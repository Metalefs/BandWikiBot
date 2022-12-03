import { UserModel } from "@uncool/shared";
import { UserService } from "../services/user.service";
import { extractToken } from "./jwt.extract";
export async function userLoggedIn(req,res,userService:UserService):Promise<UserModel>{
  const token = extractToken(req);
  if(token)
    return await userService.getByToken(token);
  throw 'Token not found';
}
