import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config';

// Imports de los modelos
import User from '../../models/User';
import Role from '../../models/Role';
import logger from '../../libs/logger';

/**
 * Comprueba si el token es válido.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    // Obtener el token del header.
    const token = req.cookies.token;

    // Si no hay token, redirigir al login.
    if (!token) {
        req.flash('warning_msg', 'No token, please login');
        res.redirect('/login');
        return;
    }

    try {
        // Comprobar el token y obtener el payload.
        const decoded: string | JwtPayload = jwt.verify(token, config.JWT_SECRET);
        const decodeObject = JSON.parse(JSON.stringify(decoded));

        // Comprobar si el id del usuario es válido.
        const user = await User.findById(decodeObject.id, { password: 0 });

        // Si el usuario no existe, redirigir al login.
        if (!user) {
            req.flash('warning_msg', 'User does not exist');
            res.redirect('/login');
            return;
        }

        // Si el usuario existe, guardarlo en la request.
        req.userId = user._id;

        // Si todo es correcto, pasar al siguiente middleware.
        next();
    } catch (error) {
        // Si hay un error, redirigir al inicio.
        req.flash('error_msg', 'Token is not valid');
        logger.error(`Error al comprobar el token: ${error}`);
        res.redirect('/');
        return;
    }
}

/**
 * Comprueba si el usuario actual tiene el rol de administrador.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export async function isAdminOrArtist(req: Request, res: Response, next: NextFunction) {
    try {
        // Obtener el usuario actual de la request.
        const user = await User.findById(req.userId);    

        // Comprobamos si se encuentra el usuario.
        if (!user) {
            req.flash('error_msg', 'No se encuentra el usuario.');
            logger.warn(`No se encuentra el usuario: ${req.userId}`);
            res.redirect('/login');
            return;
        }

        // Obtener el rol del usuario.
        const roles = await Role.find({ _id: { $in: user?.roles } });

        // Comprobar si el usuario tiene el rol de administrador.
        if (roles.some(role => role.name === 'admin' || role.name === 'artist')) {
            next();
            return;
        } else {
            // Si no es administrador, redirigir al inicio.
            req.flash('warning_msg', 'No tienes permisos para acceder a esta página.');
            logger.warn(`El usuario ${req.userId} no tiene permisos para acceder a esta página.`);
            res.redirect('./');
            return;
        }

    } catch (error) {
        logger.error(`Error al comprobar el rol: ${error}`);
        res.redirect('/login');
        return;
    }
}
