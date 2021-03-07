import { Album } from "../entity/Album";
import { Arg,Ctx, Field, FieldResolver , InputType, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Track } from "../entity/Track";
import { isAuth, isUser } from "../helpers/authHelpers";
import { AuthContext } from "../AuthContext";
import { Artiste } from "../entity/Artiste";
import { CheckIfUserIsArtiste } from "../helpers/artisteHelpers";
import { ApolloError } from "apollo-server-express";
import { ObjectID } from "typeorm";

@InputType()
class AlbumTrackInput {

    @Field()
    title: string;

    @Field()
    coverPhoto: string;

    @Field()
    song: string;

    @Field()
    genre : string
}

@Resolver(Album)
export class AlbumResolver {

    @FieldResolver(() => [Track])
    async tracks(@Root() album : Album ): Promise<Array<Track>> {
        return await Track.find({ where : { albumId : album.tracksRefID }})
    }

    @FieldResolver(() => [Artiste], { nullable: true })
    async artiste(@Root() album: Album): Promise<Artiste | null> {
        const artiste = await Artiste.findOne(album.artisteId);

        if (!artiste) {
            return null
        }

        return artiste
    }

    @Query(() => [Album])
    async getAlbums(
        @Arg("take", { defaultValue : 10}) take : number = 10
    ): Promise<Array<Album>> {
        return await Album.find({ take });
    }

    @Mutation(() => Album)
    @UseMiddleware(isAuth)
    async createNewAlbum(
        @Arg("title") title: string,
        @Arg("tracks", () => [AlbumTrackInput]) tracks: AlbumTrackInput[],
        @Arg("coverPhoto") coverPhoto: string,
        @Arg("genre") genre : string,
        @Ctx() { payload } : AuthContext
    ): Promise<Album> {

        const user = await isUser(payload?.userId);

        const isArtiste = await CheckIfUserIsArtiste(user.id.toString());

        if (!isArtiste) {
            throw new ApolloError("You are not allowed to upload albums, First become an Artiste")
        }

        const artiste = await Artiste.findOne({ where: { userId: user.id.toString() } });

        if (!artiste) {
            throw new ApolloError("You are not allowed to upload albums, First become an Artiste")
        }

        const album = new Album({ title , genre, coverPhoto, artisteId : artiste.id.toString()});

        // Todo : Please change to UUID
        album.tracksRefID = Math.random().toString()

        const albumTracks : Array<ObjectID> = [];

        tracks.forEach(async (track,i) => {
            const { title: trackTitle, genre, song, coverPhoto } = track
            const newTrack = new Track({ title: trackTitle, song, coverPhoto, genre, albumName: title, artisteId: artiste.id.toString(), positionInAlbum : i+1 });

            newTrack.albumId = album.tracksRefID;
            await newTrack.save();

            albumTracks.push(newTrack.id);
        });

        await album.save();

        return album
    }

}