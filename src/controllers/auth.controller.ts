import { Request, Response } from 'express';
import { config } from '../config';
import jwt from 'jsonwebtoken';

// Imports de los modelos
import User from '../models/User';
import Role from '../models/Role';
import logger from '../libs/logger';

export function renderLogin(req: Request, res: Response) {
    res.render('auth/login')
}

/**
 * Inicio de sesión
 * 
 * @param req 
 * @param res 
 */
export async function login(req: Request, res: Response) {
    try {
        // Buscamos el usuario por el email
        const user = await User.findOne({ email: req.body.email });

        // Si no existe el usuario mostramos un mensaje
        if (!user) {
            req.flash('info_msg', 'El usuario no existe');
            res.redirect('/login');
            return;
        }

        // Comprobamos la contraseña
        const isValid = await User.comparePassword(req.body.password, user.password);

        // Si la contraseña es incorrecta mostramos un mensaje
        if (!isValid) {
            req.flash('warning_msg', 'Contraseña incorrecta');
            res.redirect('/login');
            return;
        }

        // Si todo es correcto creamos el token
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        // Establecemos el token en la cookie      
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 86400000 // expires in 24 hours
        });

        // Guardamos el usuario en la sesión para poder usarlo en el resto de la aplicación
        req.session.user = user;

        // Redireccionamos al usuario a la página de inicio
        req.flash('info_msg', `Bienvenido de nuevo ${user.username}!`);

        res.redirect('/');

    } catch (error) {
        logger.error(`Error al iniciar sesión: ${error}`);
    }

}

export function renderSignup(req: Request, res: Response) {
    res.render('auth/signup')
}

/**
 * Resgistro de usuarios
 * 
 * @param req 
 * @param res 
 */
export async function signup(req: Request, res: Response) {
    try {
        // Desestructuramos el body para obtener los datos del usuario
        const { username, email, password } = req.body;

        // Creamos un nuevo objeto de usuario
        const user = new User({
            username,
            email,
            password: await User.encryptPassword(password)
        });

        // Establecemos el rol de usuario
        if (req.body.roles > 1) {
            const roles = await Role.find({ name: { $in: req.body.roles } });
            user.roles = roles.map(role => role._id);
        } else {
            // Si no pasamos roles, establecemos el rol por defecto
            const role = await Role.findOne({ name: 'user' });
            user.roles = [role?._id];
        }

        // Guardamos el usuario en la base de datos
        const savedUser = await user.save();

        // Creamos el token para el nuevo usuario
        const token = jwt.sign({ id: savedUser._id }, config.JWT_SECRET, {
            expiresIn: 86400 // 1 day
        });

        // Redireccionamos al usuario a la página de inicio de session
        res.redirect('/login');

    } catch (error) {
        logger.error(`Error al registrar usuario: ${error}`);
    }
}

export function renderForgot(req: Request, res: Response) {
    res.render('auth/forgot')
}

/**
 * Cierra la session de un usuario, borrando la cookie de sesión
 * y la sesión en el servidor.
 * 
 * @param req 
 * @param res 
 */
export function logout(req: Request, res: Response) {
    req.session.destroy((err) => {
        if (err) {
            logger.error(`Error al cerrar sesión: ${err}`);
        } else {
            res.clearCookie('token');
            res.redirect('/');
        }
    });
}