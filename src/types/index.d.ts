import { IUser } from "../models/User";
import session from "express-session";

declare module "express-session" {
    export interface Session {
        user: IUser;
    }
}

export { };

declare global {
    namespace Express {
        interface Request {
            user: IUser;
            userId: string;
        }        
    }
}
