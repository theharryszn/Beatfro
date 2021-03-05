import { User } from "../entity/User";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { Blog } from "../entity/Blog";
import { compare, hash } from "bcryptjs";
import { ApolloError } from "apollo-server-express";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../helpers/tokenHelpers";
import { AuthContext } from "../AuthContext";
import { getConnection } from "typeorm";

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

    @FieldResolver()
    async blogs(@Root() user: User): Promise<Array<Blog>> {
        return Blog.find({ where : { postedBy : user }})
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
        }) take? : number
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
        @Ctx() { res } : AuthContext
    ): Promise<AuthResponse>{
        const hashedPassword = await hash(password + userName[0] + email, 12);

        // const hashedPassword = await hash(password, 12);
        
        const user = new User({ userName, email, password : hashedPassword });

        await user.save();

        sendRefreshToken(res, createAccessToken(user))
        return {
            user,
            accesstoken : createRefreshToken(user)
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
        @Ctx() { res} : AuthContext
    ): Promise<AuthResponse> {
        const user = await User.findOne({ where: { email } })
        
        if(!user){
            throw new ApolloError("Incorrect Email or Password")
        }

        const passwordIsCorrect = await compare(password + user?.userName[0] + email, user?.password);

        // const passwordIsCorrect = await compare(password, user?.password);

        if (!passwordIsCorrect) {
            throw new ApolloError("Password is incorrect")
        }

        sendRefreshToken(res, createRefreshToken(user))
        
        return {
            user,
            accesstoken: createRefreshToken(user),
        }
    }
}