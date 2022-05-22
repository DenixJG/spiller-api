import { Router } from 'express';
import {
    createAlbum
} from '../controllers/album.controller';

const router: Router = Router();

router.post('/artists/albums/new', createAlbum);

export default router;
