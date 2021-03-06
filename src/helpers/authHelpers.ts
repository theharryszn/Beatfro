import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { AuthContext } from "../AuthContext";
import { User } from "../entity/User";
import { AuthenticationError } from "apollo-server-express";

// bearer 102930ajslkdaoq01

export const isAuth: MiddlewareFn<AuthContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  // console.log(authorization)

  if (!authorization) {
    throw new AuthenticationError("Not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];

    console.log(token);
    
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);

    console.log(payload)
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("not authenticated");
  }

  return next();
};


export const isUser = async (userId : string | undefined ) : Promise<User> => {
    const user = await User.findOne(userId);


    if (!user) {
        throw new AuthenticationError("You are not a User");
    }
    
    return user
}


export const CheckIfUserAlreadyExist = async (email: string): Promise<Boolean> => {
  
  const foundUser = await User.findOne({ where: { email } })
  
  if (foundUser) {
    return true
  }
  
  return false;

}