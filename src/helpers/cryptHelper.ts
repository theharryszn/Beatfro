import { compare, hash } from "bcryptjs";
import { User } from "../entity/User";

interface UserInfo {
    userName: string,
    email : string
}

export const hashPassword = async (password: string, userInfo: UserInfo): Promise<string> => {
    const { userName, email } = userInfo;
    const hashedPassword = await hash(password + userName[0] + email, 12);

    console.log(hashedPassword,"finished hash")

    const hashedPasswordWithSecret = await hash(process.env.P_SECRET! + hashedPassword, 12);

    return hashedPasswordWithSecret;
}

export const comparePassword = async (password: string, user: User): Promise<Boolean> => {

    const { userName, email } = user;
    const hashedPassword = await hash(password + userName[0] + email, 12);

    console.log(hashedPassword)


    const passwordIsCorrect = await compare(process.env.P_SECRET! + hashedPassword, user?.password);
    
    return passwordIsCorrect;
}