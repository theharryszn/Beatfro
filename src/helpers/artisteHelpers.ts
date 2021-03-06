import { User } from "../entity/User"

export const CheckIfUserIsArtiste = async (userId : string) : Promise<Boolean>  => {
    const user = await User.findOne(userId);

    if (!user) {
        throw new Error("User does'nt exist");
    }
    
    return user.isArtiste;
}