import { Blog } from "../entity/Blog";
import { Arg, Ctx, FieldResolver, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription, UseMiddleware } from "type-graphql";
import { User } from "../entity/User";
import { AuthContext } from "../AuthContext";
import { isAuth, isUser } from "../helpers/authHelpers";
import { Track } from "../entity/Track";

@Resolver(Blog)
export class BlogResolver {

    @FieldResolver(() => User, { nullable : true})
    async postedBy(@Root() blog: Blog): Promise<User | null> {
        const user = await User.findOne(blog.postedById);
        
        if (!user) {
            // throw new ApolloError("Blog error")
            return null
        };

        return user
    }

    @FieldResolver(() => Track, { nullable: true })
    async pinnedTrack(@Root() blog: Blog): Promise<Track | null> {
        const track = await Track.findOne(blog.pinnedTrackId);

        console.log("mumu",blog.pinnedTrackId)

        if (!track) {
            return null
        }

        return track
    }

    @Query(() => [Blog])
    async getBlogs(
        @Arg("take", {
            defaultValue : 10
        }) take : number
    ): Promise<Array<Blog>> {
        return await Blog.find({ take, order : { dateAdded : "ASC"} });
    }

    @Subscription(() => [Blog], {
        topics : ["BLOGS"]
    })
    async subscribeToBlogs(
        @Arg("take", {
            defaultValue : 10
        }) take : number
    ): Promise<Array<Blog>> {
        return await Blog.find({ take, order : { id : "ASC" } });
    }

    @Mutation(() => Blog)
    @UseMiddleware(isAuth)
    async createBlogPost(
        @Arg("caption") caption: string,
        @Ctx() { payload }: AuthContext,
        @PubSub() pubSub: PubSubEngine
    ): Promise<Blog> {
        
        const user = await isUser(payload?.userId);

        const blog = new Blog({ caption, postedById : user.id.toString() });

        await blog.save();

        pubSub.publish("BLOGS", await Blog.find({}));

        return blog;
    }

    
}