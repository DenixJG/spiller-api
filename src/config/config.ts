import { config } from 'dotenv';
config();

export default{
    PORT: process.env.PORT || 4000,
    MONGODB_URI: process.env.MONGODB_URI || undefined
}