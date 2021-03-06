import { Track } from "../entity/Track";
import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { Artiste } from "../entity/Artiste";
import { ApolloError } from "apollo-server-express";

@Resolver(Track)
export class TrackResolver {

    @Query(() => [Track])
    async getTracks(
        @Arg("take", {
            defaultValue : 10
        }) take : number
    ): Promise<Array<Track>> {
        return await Track.find({ take });
    }

    @FieldResolver(() => Artiste)
    async artiste(@Root() track : Track): Promise<Artiste> {
        const artiste = await Artiste.findOne({ where: { artisteId: track.artisteId } });

        if (!artiste) {
            throw new ApolloError("Artiste Error")
        }
        
        return artiste;
    }

    @Mutation(() => Track)
    async addTrack(): Promise<Track> {
        const track = new Track();

        return track
    }
}