import { connect, disconnect, mongo, connection } from 'mongoose';
import { config } from '../config';
import logger from '../libs/logger';

const URI = 'mongodb://localhost:27017/test';

export async function connectMongoDb() {
    await connect(config.MONGODB_URI || URI)
        .then(() => {
            logger.info(`Conexión con MongoDB establecida`);
            logger.info(`Conectado a MongoDB en la URI: ${config.MONGODB_URI || URI}`);
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