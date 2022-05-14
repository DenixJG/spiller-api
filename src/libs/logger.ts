import { createLogger, format, Logger, transports } from 'winston';

/**
 * Logger
 */
const logger: Logger = createLogger({
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