import { Request, Response } from 'express';

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
