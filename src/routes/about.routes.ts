import { Router } from 'express';
import {
    renderAbout,
    renderTeam,
    renderTerms
} from '../controllers/about.controller';

const router: Router = Router();

/**
 * GET /about - Renderiza la página de "Acerca de"
 */
router.get('/about', renderAbout);

/**
 * GET /team - Renderiza la página de "Equipo"
 */
router.get('/team', renderTeam);

/**
 * GET /terms - Renderiza la página de "Términos y condiciones"
 */
router.get('/terms', renderTerms);

export default router;
