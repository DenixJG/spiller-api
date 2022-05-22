import { Router } from 'express';
import { renderIndex, search } from '../controllers/index.controller';

const router: Router = Router();

/**
 * GET / - Renderiza la página principal
 */
router.get('/', renderIndex);

/**
 * POST /search - Busca una canción o artista en la base de datos.
 */
router.post('/search', search);

export default router;
