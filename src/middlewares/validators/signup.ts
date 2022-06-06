import { Request, Response, NextFunction } from 'express';
import logger from '../../libs/logger';

// Imports de modelos
import { ROLES } from '../../models/Role';
import User from '../../models/User';

/**
 * Comprueba si el nombre de usuario o el correo ya existen en la base de datos.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function checkDuplicateUsernameOrEmail(req: Request, res: Response, next: NextFunction) {
    try {
       // Obtener el usuario de la base de datos por el campo username
        const user = await User.findOne({ username: req?.body?.username });

        // Si el usuario existe, devolver error
        if (user) {
            req.flash('warning_msg', 'El nombre de usuario ya existe');
            res.redirect('/signup');
            return;
        }

        // Obtener el usuario de la base de datos por el campo email
        const userEmail = await User.findOne({ email: req?.body?.email });

        // Si el usuario exitse, devuelve un error
        if (userEmail) {
            return res.status(400).json({ message: 'El correo ya existe' });
        }

        //  Si el usuario no existe, continua con el siguiente middleware
        next();
    } catch (error) {
        logger.error(`Error al comprobar duplicidad de usuario o correo: ${error}`);
        return res.status(500).json({ message: 'Error al comprobar', error });
    }
}

/**
 * Comprueba si el rol del usuario es válido, es decir, si el rol existe en la base de datos.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export function checkRolesExist(req: Request, res: Response, next: NextFunction) {
    // Obtenemos el rol del usuario de la petición
    if (req.body.roles) {
        // Iteramos por cada rol del usuario
        for (const role of req.body.roles) {
            // Si el rol no existe en la base de datos, devolvemos un error
            if (!ROLES.includes(role)) {
                logger.warn(`Rol ${role} no existe`);
                return res.status(400).json({ message: 'Role does not exist' });
            }
        }
    }

    // Si todo va bien, continua con el siguiente middleware
    next();
}