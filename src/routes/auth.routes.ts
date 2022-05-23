import { Router } from 'express';
import { checkDuplicateUsernameOrEmail, checkRolesExist } from '../middlewares/validators/signup';
import { verifyToken } from '../middlewares/jwt/jwt';
import {
    renderForgot,
    renderLogin,
    renderSignup,
    login,
    signup,
    logout,
    renderProfile
} from '../controllers/auth.controller';

const router: Router = Router();

/**
 * GET /login - Renderiza la página de "Login"
 */
router.get('/login', renderLogin);

/**
 * POST /login - Inicia sesión
 */
router.post('/login', login);

/**
 * GET /signup - Renderiza la página de "Registro"
 */
router.get('/signup', renderSignup);

/**
 * POST /signup - Registra un nuevo usuario, verificando que no exista un usuario con el mismo nombre de usuario o correo electrónico.
 */
router.post('/signup', [checkDuplicateUsernameOrEmail, checkRolesExist], signup);

/**
 * GET /forgot - Renderiza la página de "Olvidé mi contraseña"
 */
router.get('/forgot', renderForgot);

/**
 * GET /login/logout - Cierra la sesión actual, verificando que el usuario esté autenticado.
 */
router.get('/login/logout', [verifyToken], logout);

/**
 * GET /profile - Renderiza la página de "Perfil", verificando que el usuario esté autenticado.
 */
router.get('/profile', [verifyToken], renderProfile);

export default router;
