import app from "./app";
import logger from "./libs/logger";

function main() {
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