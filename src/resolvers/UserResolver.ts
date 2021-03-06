import { User } from "../entity/User";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, PubSub, Query, Resolver, Root, Subscription } from "type-graphql";
import { Blog } from "../entity/Blog";
import { compare, hash } from "bcryptjs";
import { AuthenticationError, PubSubEngine } from "apollo-server-express";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../helpers/tokenHelpers";
import { AuthContext } from "../AuthContext";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import { CheckIfUserAlreadyExist } from "../helpers/authHelpers";

@ObjectType()
class AuthResponse {

    @Field(() => User)
    user: User;

    @Field()
    accesstoken: string;
}

/**
 * @class User
 * 
 * Resolver for User Entity
 */
@Resolver(User)
export class UserResolver {

    @Query(() => User, { nullable: true })
    me(@Ctx() context: AuthContext) {
      const authorization = context.req.headers["authorization"];
  
      if (!authorization) {
        return null;
      }
  
      try {
        const token = authorization.split(" ")[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return User.findOne(payload.userId);
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  

    @FieldResolver()
    async blogs(@Root() user: User): Promise<Array<Blog>> {
        return Blog.find({ where : { postedById : user.id }})
    }

    @Subscription(() => [User],{
        topics: ["USERS"]
    })
    async subscribeToUsers(
        @Arg("take", {
            defaultValue : 10
        }) take?: number,
    ) : Promise<Array<User>> {
        return await User.find({ take })
    }

    /**
     * 
     * @param take 
     * Limit (paginated) - max number of entities should be taken. Default Value is 10
     * 
     */
    @Query(() => [User])
    async getUsers(
        @Arg("take", {
            defaultValue : 10
        }) take?: number,
    ): Promise<Array<User>> {
        return await User.find({ take })
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { res }: AuthContext) {
        sendRefreshToken(res, "");

        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
        await getConnection()
        .getRepository(User)
        .increment({ id: userId }, "tokenVersion", 1);

        return true;
    }

    /**
     * 
     * @param userName
     * @param email
     * @param password
     * 
     * @description Creates a new User
     * 
     */
    @Mutation(() => AuthResponse)
    async createUser(
        @Arg("userName") userName: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: AuthContext,
        @PubSub() pubSub: PubSubEngine
    ): Promise<AuthResponse>{

        const found = await CheckIfUserAlreadyExist(email);
        
        if (found) {
            throw new AuthenticationError(`User with email ${email} already exists`);
        }

        const hashedPassword = await hash(password + userName[0] + email, 12);

        // const hashedPassword = await hash(password, 12);
        
        const user = new User({ userName, email, password : hashedPassword });

        await user.save();

        sendRefreshToken(res, createRefreshToken(user));

        pubSub.publish("USERS", await User.find({}));

        return {
            user,
            accesstoken : createAccessToken(user)
        };
    }

    /**
     * 
     * @param email
     * @param password
     * 
     * @description Function to login Users
     */
    @Mutation(() => AuthResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: AuthContext,
        @PubSub() pubSub: PubSubEngine
    ): Promise<AuthResponse> {
        const user = await User.findOne({ where: { email } })
        
        if(!user){
            throw new AuthenticationError("Incorrect Email or Password")
        }

        const passwordIsCorrect = await compare(password + user?.userName[0] + email, user?.password);

        // const passwordIsCorrect = await compare(password, user?.password);

        if (!passwordIsCorrect) {
            throw new AuthenticationError("Password is incorrect")
        }

        sendRefreshToken(res, createRefreshToken(user));

        pubSub.publish("USERS", await User.find({}));
        
        return {
            user,
            accesstoken: createAccessToken(user),
        }
    }
}