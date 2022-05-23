import { Router } from 'express';
import {
    createAlbum, renderViewAlbum
} from '../controllers/album.controller';

const router: Router = Router();

/**
 * POST /artists/albums/new - Crea un nuevo album.
 */
router.post('/artists/albums/new', createAlbum);

/**
 * GET /artists/albums/:id - Renderiza la vista de detalles de un album.
 */
router.get('/artists/albums/:id', renderViewAlbum);

export default router;
