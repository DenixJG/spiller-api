import { config } from 'dotenv';
config();

export default {
    // Configuracion de puerto
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
    MONGODB_PORT: process.env.MONGODB_PORT || 27017,
    MONGODB_USERNAME: process.env.MONGODB_USERNAME || 'root',
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || 'example',
    
    // Claves secretas
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'secret',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',

    // Credenciales de usuario administrador
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@localhost.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
}
