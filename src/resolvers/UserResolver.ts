import { User } from "../entity/User";
import { Arg, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root } from "type-graphql";
import { Blog } from "../entity/Blog";
import { compare, hash } from "bcryptjs";
import { ApolloError } from "apollo-server-express";

@ObjectType()
class AuthResponse {

    @Field(() => User)
    user: User;

    @Field()
    accesstoken: string;

    @Field()
    refreshtoken : string
}

@Resolver(User)
export class UserResolver {

    @FieldResolver()
    async blogs(@Root() user: User): Promise<Array<Blog>> {
        return Blog.find({ where : { postedBy : user }})
    }

    @Query(() => [User])
    async getUsers(
        @Arg("take", {
            defaultValue : 10
        }) take? : number
    ): Promise<Array<User>> {
        return await User.find({ take })
    }

    @Mutation(() => User)
    async createUser(
        @Arg("userName") userName: string,
        @Arg("email") email: string,
        @Arg("password") password : string
    ): Promise<User>{
        // const hashedPassword = await hash(password + userName[0] + email, 12);

        const hashedPassword = await hash(password, 12);
        
        const user = new User({ userName, email, password : hashedPassword });

        await user.save();

        return user;
    }

    @Mutation(() => AuthResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password : string
    ): Promise<AuthResponse> {
        const user = await User.findOne({ where: { email } })
        
        if(!user){
            throw new ApolloError("Incorrect Email or Password")
        }

        // const passwordIsCorrect = await compare(password + user?.userName[0] + email, user?.password);

        const passwordIsCorrect = await compare(password, user?.password);

        if (!passwordIsCorrect) {
            throw new ApolloError("Password is incorrect")
        }
        
        return {
            user,
            accesstoken: "",
            refreshtoken : ""
        }
    }
}