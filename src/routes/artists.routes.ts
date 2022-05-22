import { Router } from 'express';
import { createNewArtist, renderViewArtist } from '../controllers/artists.controller';
import { verifyToken } from '../middlewares/jwt/jwt';
import { checkRolesExist } from '../middlewares/validators/signup';

const router: Router = Router();

/**
 * GET /artists/:id - Renderiza la vista de un artista
 */
router.get('/artists/:id', renderViewArtist)

/**
 * POST /artists/new - Crear un nuevo artista
 */
router.post('/artists/new', [verifyToken, checkRolesExist], createNewArtist);

export default router;
