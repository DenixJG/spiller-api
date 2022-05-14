import { Router } from 'express';
import {logout, renderForgot, renderLogin, renderSignup } from '../controllers/auth.controller';
const router: Router = Router();

router.get('/login', renderLogin);

router.get('/signup', renderSignup);

router.get('/forgot', renderForgot);

router.get('/login/logout', logout);

export default router;