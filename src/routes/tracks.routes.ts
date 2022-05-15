import { Router } from 'express';
import { isAdminOrArtist, verifyToken } from '../middlewares/jwt/jwt';
import {
    newTrack,
    renderNewTrack,
    renderTracks,    
    streamTrackFile
} from '../controllers/tracks.controller';

const router: Router = Router();

router.get('/tracks', renderTracks);

router.get('/tracks/new', [verifyToken, isAdminOrArtist], renderNewTrack);
router.post('/tracks/new', [verifyToken, isAdminOrArtist], newTrack);

router.get('/tracks/play/:id', streamTrackFile);

export default router;
