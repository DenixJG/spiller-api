import { Router } from 'express';

const router: Router = Router();

router.get('/index', (req, res) => {
    res.status(200).render('index');
});

export default router;