import express, { Application, ErrorRequestHandler, NextFunction } from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { config } from './config';
import { httpLogger } from './middlewares/CustomLogger';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import hbsHelpers from 'handlebars-helpers';

// Importar rutas
import * as routes from './routes';

// Importar librerias
import { createAdmin, createRoles } from './libs/initialSetup';
import logger from './libs/logger';

const app: Application = express();

// Configuracion inicial de la base de datos.
createRoles();
createAdmin();

// Ajustes de la aplicación
app.set('port', config.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: hbsHelpers()
}));
app.set('view engine', 'hbs')

const MONGODB_URI = `mongodb://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@${config.MONGODB_HOST}:${config.MONGODB_PORT}/?authMechanism=DEFAULT`;

// Middlewares
app.use(httpLogger()); // Loger personalizado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: config.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGODB_URI
        }),
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
);
app.use(flash()); // Para mostrar mensajes de flash

// Variables globales
app.use((req, res, next) => {
    res.locals.info_msg = req.flash('info_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user;
    res.locals.role = req.session.role;

    next();
});

// Rutas
app.use('/', routes.indexRoute);
app.use('/', routes.authRoutes);
app.use('/', routes.tracksRoutes);
app.use('/', routes.artistsRoutes);
app.use('/', routes.playlistsRoutes);
// app.use('/', routes.recordCompanyRoutes); // No se usa
app.use('/', routes.aboutRoutes);
app.use('/', routes.albumRoutes);

// Ficheros estáticos (css, js, imágenes).
app.use(express.static(path.join(__dirname, 'public')));

// Errores 404
app.use((req, res) => {
    res.status(404).render('errors/404');
});

// Errores 500
app.use((err: ErrorRequestHandler, req: express.Request, res: express.Response, next: NextFunction) => {
    logger.error(`Error: ${err}`);
    res.status(500).render('errors/500');
});

export default app;
