import { Request, Response } from 'express';
import logger from '../libs/logger';
import Artist, { IArtist } from '../models/Artist';
import Track, { ITrack } from '../models/Track';

/**
 * Pinta la página principal
 * 
 * @param req La petición HTTP
 * @param res La respuesta HTTP
 */
export function renderIndex(req: Request, res: Response) {
    res.render('index', {
        title: 'Spiller Music'
    });
}

/**
 * Buscar en la base de datos tracks y artist por el nombre, devuelve
 * una lista de resultados con los objetos encontrados en la base de
 * datos.
 * 
 * Obtiene el termino de búsqueda del body de la petición y lo pasa
 * a la función de búsqueda de la base de datos.
 * 
 * @param req 
 * @param res 
 */
export async function search(req: Request, res: Response) {
    try {
        // Desestructurar el body
        const { query } = req.body;

        // Buscar en la base de datos
        const tracks: ITrack[] = await Track.find({
            name: { $regex: query, $options: 'i' }
        }).populate('artistId').limit(4).lean();

        // Buscar nombre de artista
        const artists: IArtist[] = await Artist.find({
            name: { $regex: query, $options: 'i' }
        }).limit(4).lean();

        const results: Object = {
            tracks: tracks,
            artists: artists
        }

        res.render('tracks/list', {
            title: 'Resultados de la búsqueda',
            results: results
        });

    } catch (error) {
        logger.error(`Error al buscar: ${error}`);
    }
}

