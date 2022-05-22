import { Router } from 'express';
import { verifyToken } from '../middlewares/jwt/jwt';
import {
    addTrackToPlaylist,
    createPlaylist,
    renderNewPlaylist,
    renderPlaylists,
    renderViewPlaylist
} from '../controllers/playlists.controller';

const router: Router = Router();

/**
 * GET /profile/playlists - Renderiza la página de "Playlists", comprobando que 
 * el usuario esté autenticado.
 */
router.get('/profile/playlists', [verifyToken], renderPlaylists);

/**
 * GET /profile/playlists/new - Renderiza la página de "Crear nueva playlist", comprobando
 * que el usuario esté autenticado.
 */
router.get('/profile/playlists/new', [verifyToken], renderNewPlaylist);

/**
 * POST /profile/playlists/new - Crea una nueva playlist, comprobando
 * que el usuario que intenta crear la playlist este autenticado.
 */
router.post('/profile/playlists/new', [verifyToken], createPlaylist);

/**
 * GET /profile/playlists/:id - Renderiza la página de "Ver playlist", comprobando
 * que el usuario que intenta acceder a la página esté autenticado.
 */
router.get('/profile/playlists/:id', [verifyToken], renderViewPlaylist);

/**
 * POST /profile/playlists/track - Agrega una canción a una playlist, comprobando
 * que el usuario que intenta agregar la canción a la playlist este autenticado.
 */
router.post('/profile/playlists/track', [verifyToken], addTrackToPlaylist);

export default router;
