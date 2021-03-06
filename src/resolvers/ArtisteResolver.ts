import { Artiste } from "../entity/Artiste";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Track } from "../entity/Track";
import { isAuth, isUser } from "../helpers/authHelpers";
import { AuthContext } from "../AuthContext";
import { User } from "../entity/User";
import { ApolloError } from "apollo-server-express";

@Resolver(Artiste)
export class ArtisteResolver{

    @Query(() => [Artiste])
    async getArtistes(
        @Arg("take", {
            defaultValue : 10
        }) take : number
    ): Promise<Array<Artiste>> {
        return await Artiste.find({ take });
    }

    @FieldResolver(() => [Track])
    async tracks(@Root() artiste: Artiste): Promise<Array<Track>> {
        return await Track.find({ where : { artisteId : artiste.id }});
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
        @Ctx() { payload } : AuthContext
    ): Promise<Artiste> {
        const user = await isUser(payload?.userId);

        const artiste = new Artiste({ stageName, coverPhoto, userId: user.id.toString() });

        await artiste.save();

        return artiste;
    }
}