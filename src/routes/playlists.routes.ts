import { Router } from 'express';
import { verifyToken } from '../middlewares/jwt/jwt';
import { createPlaylist, renderNewPlaylist, renderPlaylists, renderViewPlaylist } from '../controllers/playlists.controller';

const router: Router = Router();

router.get('/profile/playlists', [verifyToken], renderPlaylists);

router.get('/profile/playlists/new', [verifyToken], renderNewPlaylist);

router.post('/profile/playlists/new', [verifyToken], createPlaylist);

router.get('/profile/playlists/:id', [verifyToken], renderViewPlaylist);

export default router;