import { Router } from 'express';
import { isAdminOrArtist, verifyToken } from '../middlewares/jwt/jwt';
import {
    newTrack,
    renderNewTrack,
    renderTracks,
    streamTrackFile
} from '../controllers/tracks.controller';

const router: Router = Router();

/**
 * GET /tracks - Renderiza la página de "Tracks"
 */
router.get('/tracks', renderTracks);

/**
 * GET /tracks/new - Renderiza la página de "Crear nueva track", comprobando
 * que el usuario que intenta acceder a la vista este autenticado.
 */
router.get('/tracks/new', [verifyToken, isAdminOrArtist], renderNewTrack);

/**
 * POST /tracks/new - Crea una nueva track, comprobando que el usuario que intenta
 * crear la track este autenticado.
 */
router.post('/tracks/new', [verifyToken, isAdminOrArtist], newTrack);

/**
 * GET /tracks/play/:id - Reproduce una track en streaming.
 */
router.get('/tracks/play/:id', streamTrackFile);

export default router;
