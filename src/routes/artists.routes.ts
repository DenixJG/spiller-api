import { Router } from 'express';
import { createNewArtist } from '../controllers/artists.controller';
import { verifyToken } from '../middlewares/jwt/jwt';
import { checkRolesExist } from '../middlewares/validators/signup';

const router: Router = Router();

router.post('/artists/new', [verifyToken, checkRolesExist], createNewArtist);

export default router;