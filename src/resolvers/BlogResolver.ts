import { Blog } from "../entity/Blog";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Blog)
export class BlogResolver {

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
        @Arg("caption") caption : string
    ): Promise<Blog> {
        const blog = new Blog({ caption });

        await blog.save();

        return blog;
    }

    
}