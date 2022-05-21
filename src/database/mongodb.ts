import { connect, disconnect, mongo, connection } from 'mongoose';
import { config } from '../config';
import logger from '../libs/logger';

const MONGODB_URI = `mongodb://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@${config.MONGODB_HOST}:${config.MONGODB_PORT}`;

export async function connectMongoDb() {
    await connect(MONGODB_URI)
        .then(() => {
            logger.info(`Conexión con MongoDB establecida`);
            logger.info(`Conectado a MongoDB en la URI: ${MONGODB_URI}`);
        })
        .catch((err) => {
            logger.error(`Error al conectar con MongoDB: ${err.message}`);
            disconnect();
        })
}

export function getBucket(name: string) {
    return new mongo.GridFSBucket(connection.db, {
        bucketName: name
    })
}