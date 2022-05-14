import { createLogger, format, Logger, transports, addColors } from 'winston';

/**
 * Logger personalizado para la aplicacion que usa winston.
 */
const logger: Logger = createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    level: (process.env.NODE_ENV === 'development') ? 'debug' : 'warn',
    transports: [
        new transports.File({
            dirname: 'logs',
            filename: 'info.log',
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ],
    format: format.combine(
        format.timestamp(),
        format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
    )
});

// Establecemos los colores de los niveles de log
addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'gray'
});

// Si estamos en modo desarrollo, activamos el modo debug y mostramos
// por consola los logs
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.printf(info => {
                return `${info.level}: ${info.message}`;
            })
        ),
    }));
}

export default logger;