import { Track } from "../entity/Track";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Artiste } from "../entity/Artiste";
import { isAuth, isUser } from "../helpers/authHelpers";
import { AuthContext } from "../AuthContext";
import { CheckIfUserIsArtiste } from "../helpers/artisteHelpers";
import { ApolloError, AuthenticationError } from "apollo-server-express";
import { Lyric } from "../entity/Lyric";
import { getConnection } from "typeorm";

@Resolver(Track)
export class TrackResolver {

    @Query(() => [Track])
    async getTracks(
        @Arg("take", {
            defaultValue : 10
        }) take : number
    ): Promise<Array<Track>> {
        // console.log(await Track.find({ take }))
        return await Track.find({ take });
    }

    @Query(() => Track, { nullable : true})
    async getTrack(
        @Arg("id") id : string
    ): Promise < Track  | null> {
        const track = await Track.findOne(id);

        if (!track) {
            return null
        }

        return track;
    }
    
    @FieldResolver(() => Artiste, { nullable : true })
    async artiste(@Root() track : Track): Promise<Artiste | null> {
        const artiste = await Artiste.findOne(track.artisteId);

        if (!artiste) {
            // throw new ApolloError("Artiste Error")
            return null
        }
        
        return artiste;
    }

    @FieldResolver({ nullable : true})
    async lyric(@Root() track: Track): Promise<Lyric | null> {
        const lyric = await Lyric.findOne({ where: { songId: track.id.toString() } })

        if (!lyric) {
            return null
        }
        
        return lyric;
    }

    @Mutation(() => Track)
    @UseMiddleware(isAuth)
    async addTrack(
        @Arg("title") title: string,
        @Arg("coverPhoto") coverPhoto: string,
        @Arg("albumName") albumName: string = "Single",
        @Arg("song") song: string,
        @Arg("genre") genre : string,
        @Ctx() { payload } : AuthContext
    ): Promise<Track> {
        const user = await isUser(payload?.userId);

        const isArtiste = await CheckIfUserIsArtiste(user.id.toString());

        if (!isArtiste) {
            throw new ApolloError("You are not allowed to upload tracks, First become an Artiste")
        }

        const artiste = await Artiste.findOne({ where: { userId: user.id.toString() } });

        if (!artiste) {
            throw new ApolloError("You are not allowed to upload tracks, First become an Artiste")
        }

        const track = new Track({ title, coverPhoto, albumName, artisteId: artiste.id.toString(), song , genre});
        
        await track.save()

        return track
    }

    @Mutation(() => Track)
    @UseMiddleware(isAuth)
    async deleteTrack(
        @Arg("id") id: string,
        @Ctx() { payload }: AuthContext
    ): Promise<Track> {
        const user = await isUser(payload?.userId);

        if (!user) {
            throw new AuthenticationError("You are not a User")
        }

        const isArtiste = await CheckIfUserIsArtiste(user.id.toString());

        if (!isArtiste) {
            throw new ApolloError("You are not allowed to upload tracks, First become an Artiste")
        }

        const artiste = await Artiste.findOne({ where: { userId: user.id.toString() } });

        if (!artiste) {
            throw new ApolloError("You are not allowed to upload tracks, First become an Artiste")
        }

        const track = await Track.findOne(id);

        if (!track) {
            throw new ReferenceError(`The track with id : ${id} doesn't exist`);
        }

        if (track.artisteId !== artiste.id.toString()) {
            throw new AuthenticationError("You don't have the permision to delete this Track")
        }

        await getConnection().getRepository(Track).delete(track.id)

        return track
    }
}