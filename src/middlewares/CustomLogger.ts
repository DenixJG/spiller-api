import morgan, { StreamOptions } from 'morgan';

import Logger from '../libs/logger';

const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message.trim()),
};

const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};

/**
 * Morgan logger con el stream de salida sobreeescrito para usar el logger
 * de la aplicacion.
 * 
 * Formatos de salida:
 * - dev
 * - common
 * - combined
 * - short
 * - tiny
 * 
 * @param format Formato de salida, default: dev
 * @returns 
 */
export function httpLogger(format: string = 'dev') { 
    return morgan(format, {
        stream,
        skip,
    });
}