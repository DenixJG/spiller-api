import { Request, Response } from 'express';

/**
 * Rendereiza la vista de 'Sobre', en la que se muestra la información de la aplicación.
 * 
 * @param req 
 * @param res 
 */
export function renderAbout(req: Request, res: Response) {
    res.render('about/index', {
        title: 'About'
    });
}

/**
 * Renderiza la vista del equipo de desarrollo.
 * 
 * @param req 
 * @param res 
 */
export function renderTeam(req: Request, res: Response) {
    res.render('about/team', {
        title: 'Team'
    });
}

/**
 * Renderiza la vista de los terminos y condiciones.
 * 
 * @param req 
 * @param res 
 */
export function renderTerms(req: Request, res: Response) {
    res.render('about/terms', {
        title: 'Terms'
    });
}
