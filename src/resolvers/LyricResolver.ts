import { Lyric } from "../entity/Lyric";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Track } from "../entity/Track";
import { User } from "../entity/User";

@Resolver(Lyric)
export class LyricResolver {
    
    @Query(() => Lyric, { nullable: true })
    async getSongLyric(
        @Arg("songId") songId: string
    ): Promise<Lyric | null> {
        const lyric = await Lyric.findOne({ where: { songId } })

        if (!lyric) {
            return null
        }
        
        return lyric
    }

    @FieldResolver(() => Track,{ nullable : true})
    async song(@Root() lyric: Lyric): Promise<Track | null> {
        const track = await Track.findOne(lyric.songId);

        if (!track) {
            return null
        }

        return track
    }

    @FieldResolver(() => User,{ nullable : true})
    async addebBy(@Root() lyric: Lyric): Promise<User | null> {
        const user = await User.findOne(lyric.addedByUserId);

        if (!user) {
            return null
        }
        
        return user
    }
}