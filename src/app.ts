import express, { Application } from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { config } from './config';
import { httpLogger } from './middlewares/CustomLogger';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Routes imports
import indexRoute from './routes/index.routes';
import authRoutes from './routes/auth.routes';

// Import libs
import { createAdmin, createRoles } from './libs/initialSetup';

const app: Application = express();

// Database initial setup
createRoles();
createAdmin();

// Settings
app.set('port', config.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', 'hbs')

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
            mongoUrl: config.MONGODB_URI
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

// Global variables
app.use((req, res, next) => {
    res.locals.info_msg = req.flash('info_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user;   

    next();
});

// Routes
app.use('/', indexRoute, authRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Not found handler
app.use((req, res) => {
    res.render('404');
});

export default app;