import { Blog } from "../entity/Blog";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { User } from "../entity/User";
import { AuthContext } from "../AuthContext";
import { ApolloError } from "apollo-server-express";
import { isAuth, isUser } from "../helpers/authHelpers";

@Resolver(Blog)
export class BlogResolver {

    @FieldResolver(() => User)
    async postedBy(@Root() blog: Blog): Promise<User> {
        const user = await User.findOne(blog.postedById);
        
        if (!user) {
            throw new ApolloError("Blog error")
        };

        return user
    }

    @Query(() => [Blog])
    async getBlogs(
        @Arg("take", {
            defaultValue : 10
        }) take : number
    ): Promise<Array<Blog>> {
        return await Blog.find({ take });
    }

    @Mutation(() => Blog)
    @UseMiddleware(isAuth)
    async addBlogPost(
        @Arg("caption") caption: string,
        @Ctx() { payload } : AuthContext
    ): Promise<Blog> {
        
        const user = await isUser(payload?.userId);

        const blog = new Blog({ caption, postedById : user.id.toString() });

        await blog.save();

        return blog;
    }

    
}