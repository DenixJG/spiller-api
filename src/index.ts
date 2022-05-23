import app from "./app";
import logger from "./libs/logger";
import { connectMongoDb } from "./database/mongodb";

/**
 * Function principal, inicia la aplicación y la conexión a la base de datos.
 */
function main() {
    connectMongoDb();
    app.listen(app.get('port'))
        .on('listening', () => {
            logger.info(`Servidor iniciado - http://localhost:${app.get('port')}`);
        }).on('error', (err) => {
            logger.error(`Error en el servidor: ${err.message}`);
        }).on('close', () => {
            logger.info('Servidor cerrado, bye!');
        });
}

main();
