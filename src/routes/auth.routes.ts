import { Router } from 'express';
import { checkDuplicateUsernameOrEmail, checkRolesExist } from '../middlewares/validators/signup';
import { verifyToken } from '../middlewares/jwt/jwt';
import {
    renderForgot,
    renderLogin,
    renderSignup,
    login,
    signup,
    logout
} from '../controllers/auth.controller';

const router: Router = Router();

router.get('/login', renderLogin);
router.post('/login', login);

router.get('/signup', renderSignup);
router.post('/signup', [ checkDuplicateUsernameOrEmail, checkRolesExist ], signup);

router.get('/forgot', renderForgot);

router.get('/login/logout', [ verifyToken ], logout);

export default router;