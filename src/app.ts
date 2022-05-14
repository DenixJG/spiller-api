import express, { Application } from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import path from 'path';
import { config } from './config';
import logger from './libs/logger';

// Routes imports
import indexRoute from './routes/index.routes';
import authRoutes from './routes/auth.routes';

const app: Application = express();

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
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', indexRoute, authRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Not found handler
app.use((req, res) => {
    res.render('404');
});

export default app;