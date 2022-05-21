import { Router } from 'express';
import {
    renderAbout,
    renderTeam,
    renderTerms
} from '../controllers/about.controller';

const router: Router = Router();

router.get('/about', renderAbout);

router.get('/team', renderTeam);

router.get('/terms', renderTerms);

export default router;
