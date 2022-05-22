import { Request, Response } from 'express';
import RecordCompany, { IRecordCompany } from '../models/RecordCompany';
import logger from '../libs/logger';

/**
 * Rendereiza la vista de 'Record Company', en la que se muestra la información de todas Record Company.
 * 
 * @param req 
 * @param res 
 */
export function renderRecordCompany(req: Request, res: Response) {
    res.render('recordcompany/list', {
        title: 'Record Company'
    });
}

/**
 * Renderiza la vista del formulario para crear una nuevva Record Company.
 * 
 * @param req 
 * @param res 
 */
export function renderNewRecordCompany(req: Request, res: Response) {
    res.render('recordcompany/new', {
        title: 'New Record Company'
    });
}

/**
 * Crear una nueva playlist.
 * 
 * @param req 
 * @param res 
 */
export async function createRecordCompany(req: Request, res: Response) {
    console.log(req.body);
      
    try {
            // Desestrucutrar el body
            const { name, artistsId, tracksId } = req.body;
    
            // Crear el objeto
            const recordCompany: IRecordCompany = new RecordCompany({
                name: name,
                totalArtists: Array.isArray(artistsId)?artistsId.length:1,
                artistsId: artistsId,
                tracksId: tracksId
            });
            // Guardar el objeto
            const savedRecordCompany = await recordCompany.save();
    
            if (recordCompany) {
                req.flash('success_msg', 'Record Company creada');
                res.redirect('/recordcompany');
            } else {
                throw new Error('Record company no creada');
            }
    
        } catch (error) {
            logger.error(`Error al crear Record Company: ${error}`);
            req.flash('warning_msg', 'Error al crear la Record Company');
            res.redirect('/recordcompany/new');
        }
}
