import bcrypt from 'bcryptjs';
import logger from './logger';
import { config } from '../config';

// Imports de los modelos
import User from '../models/User';
import Role from '../models/Role';

// TODO: Revisar porque no se le asigna el rol de administrador la primera vez que se crea un usuario.

/**
 * Carga en la base de datos los roles iniciales.
 * 
 * @returns 
 */
export async function createRoles() {
    try {
        // Comprobamos si existen roles.
        const count = await Role.estimatedDocumentCount();

        // Si existen roles, no se hace nada.
        if (count > 0) {
            logger.info('Roles detectados en la base de datos.');
            return;
        }

        // Si no existen roles, se crean los roles.
        const roles = await Promise.all([
            new Role({ name: 'user' }).save(),
            new Role({ name: 'admin' }).save(),
            new Role({ name: 'artist' }).save()
        ]);

        logger.info(`Creados ${roles.length} roles en la base de datos.`);

    } catch (error) {
        logger.error(`Error al crear los roles: ${error}`);
    }
}

/**
 * Carga en la base de datos el usuario administrador predeterminado.
 */
export async function createAdmin() {
    // Comprobamos si existe el usuario administrador.
    const admin = await User.findOne({ email: config.ADMIN_EMAIL });

    // Obtenemos el rol de administrador.
    const roles = await Role.find({ name: { $in: ['admin'] } });

    // Si no existe el usuario, lo creamos.
    if (!admin) {
        await User.create({
            username: config.ADMIN_USERNAME,
            email: config.ADMIN_EMAIL,
            password: await bcrypt.hash(config.ADMIN_PASSWORD, 10),
            roles: roles.map(role => role._id)
        })
        logger.info('Usuario administrador creado correctamente.');
    } else {
        logger.info('Usuario administrador configurado correctamente.');
    }

}