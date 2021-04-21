import { Artiste } from "../entity/Artiste";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Track } from "../entity/Track";
import { isAuth, isUser } from "../helpers/authHelpers";
import { AuthContext } from "../AuthContext";
import { User } from "../entity/User";
import { ApolloError } from "apollo-server-express";
import { CheckIfUserIsArtiste } from "../helpers/artisteHelpers";
import { Album } from "../entity/Album";

@Resolver(Artiste)
export class ArtisteResolver {

    @Query(() => [Artiste])
    async getArtistes(
        @Arg("take", {
            defaultValue: 10
        }) take: number
    ): Promise<Array<Artiste>> {
        return await Artiste.find({ take });
    }

    @FieldResolver(() => [Track])
    async tracks(@Root() artiste: Artiste): Promise<Array<Track>> {
        return await Track.find({ where: { artisteId: artiste.id.toString() } });
    }

    @FieldResolver(() => [Album])
    async albums(@Root() artiste: Artiste): Promise<Array<Album>> {
        return await Album.find({ where: { artisteId: artiste.id.toString() } });
    }

    @FieldResolver(() => User)
    async user(@Root() artiste: Artiste): Promise<User> {
        const user = await User.findOne(artiste.userId);

        if (!user) {
            throw new ApolloError("User Error")
        }

        return user;
    }

    @Mutation(() => Artiste)
    @UseMiddleware(isAuth)
    async becomeAnArtiste(
        @Arg("stageName") stageName: string,
        @Arg("coverPhoto") coverPhoto: string,
        @Ctx() { payload }: AuthContext
    ): Promise<Artiste> {
        const user = await isUser(payload?.userId);

        const isArtiste = await CheckIfUserIsArtiste(user.id.toString());

        if (isArtiste) {
            throw new Error("You are already an Artiste");
        }

        const artiste = new Artiste({ stageName, coverPhoto, userId: user.id.toString() });

        user.isArtiste = true;

        await artiste.save();

        await user.save();


        return artiste;
    }

    @Query(() => Artiste)
    @UseMiddleware(isAuth)
    async getMyArtisteProfile(
        @Ctx() { payload }: AuthContext
    ): Promise<Artiste> {
        const profile = await Artiste.findOne({ where: { userId: payload?.userId } });

        if (!profile) {
            throw new Error("You are not an Artiste");
        }

        return profile;
    }

    @Query(() => Artiste, { nullable : true })
    async getArtiste(
        @Arg("id") id: string
    ): Promise<Artiste | null> {
        const artiste = await Artiste.findOne(id);

        if (!artiste) {
            return null
        }

        return artiste;
    }
}