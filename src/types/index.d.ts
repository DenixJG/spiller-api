/**
 * Declarar tipos de datos personalizados para ciertas variables de la aplicación. 
 */

import { IUser } from "../models/User";
import session from "express-session";

declare module "express-session" {
    export interface Session {
        user: IUser;
        role: Object;
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
