import { Blog } from "../entity/Blog";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { User } from "../entity/User";
import { AuthContext } from "src/AuthContext";
import { ApolloError } from "apollo-server-express";

@Resolver(Blog)
export class BlogResolver {

    @FieldResolver(() => User)
    async postedBy(@Root() blog: Blog): Promise<User> {
        const user = await User.findOne(blog.postedById);
        
        if (!user) {
            throw new Error("Blog error")
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
    async addBlogPost(
        @Arg("caption") caption: string,
        @Ctx() { payload } : AuthContext
    ): Promise<Blog> {
        const blog = new Blog({ caption });

        const user = await User.findOne(payload?.userId);

        if (!user) {
            throw new ApolloError("You are not a User");
        }

        blog.postedBy = user;

        await blog.save();

        return blog;
    }

    
}