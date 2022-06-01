import { config } from 'dotenv';
config();

export default {
    // Configuracion de puerto
    PORT: process.env.PORT || 4000,

    // Base de datos
    MONGODB_URI: process.env.MONGODB_URI || undefined,
    
    // Claves secretas
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'secret',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',

    // Credenciales de usuario administrador
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@localhost.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
}
