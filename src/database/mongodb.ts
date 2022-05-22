import { connect, disconnect, mongo, connection } from 'mongoose';
import { config } from '../config';
import logger from '../libs/logger';

const URI = 'mongodb://localhost:27017/test';

/**
 * Conecta a la base de datos.
 */
export async function connectMongoDb() {
    await connect(config.MONGODB_URI || URI)
        .then(() => {
            logger.info(`Conexión con MongoDB establecida`);
            logger.info(`Conectado a MongoDB en la URI: ${config.MONGODB_URI || URI}`);
        })
        .catch((err) => {
            logger.error(`Error al conectar con MongoDB: ${err.message}`);
            logger.error(`Error: ${err}`);
            disconnect();
        })
}

/**
 * Obtiene el `bucket` de MongoDB para la base de datos conectada.
 * El `bucket` es generado por el driver de mongo para poder usar
 * el sistema de `GridFS` que tiene MongoDB para almacenar archivos
 * que ocupan más de lo que se puede almacenar en un documento de MongoDB.
 * 
 * @param name Nombre del bucket.
 * @returns Retorna el bucket.
 */
export function getBucket(name: string) {
    return new mongo.GridFSBucket(connection.db, {
        bucketName: name
    })
}