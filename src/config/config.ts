import { config } from 'dotenv';
config();

export default {
    // App config
    PORT: process.env.PORT || 4000,

    // Database
    MONGODB_URI: process.env.MONGODB_URI || undefined,
    
    // Secret keys
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'secret',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',

    // Admin user credentials
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@localhost.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
}
