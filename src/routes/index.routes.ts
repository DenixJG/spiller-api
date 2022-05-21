import { Router } from 'express';
import { renderIndex, search } from '../controllers/index.controller';

const router: Router = Router();

router.get('/', renderIndex);

router.post('/search', search);

export default router;