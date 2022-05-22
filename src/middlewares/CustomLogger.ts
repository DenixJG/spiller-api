/**
 * Middleware para tratar logs de las peticiones HTTP que registra morgan(Log HTTP) con winston(Logger).
 * 
 * @author Rafael Popescu
 * @author Pedro Jorquera Hoyas
 * @version 1.0
 */

import morgan, { StreamOptions } from 'morgan';

import Logger from '../libs/logger';

/**
 * Opciones del 'stream' de morgan, le indicamos que el mensaje de salida
 * debe ser controlo por el logger, permitiendo que el mensaje sea escrito
 * en el archivo de log si asi lo requiere el entorno de desarrollo.
 */
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