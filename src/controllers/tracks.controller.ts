import { Request, Response } from 'express';
import logger from '../libs/logger';
import multer, { StorageEngine, Multer } from 'multer';
import { Readable } from 'stream';
import { getBucket } from '../database/mongodb';

// Imports de los modelos
import Track, { ITrack } from '../models/Track';
import Artist from '../models/Artist';
import User from '../models/User';
import { mongo } from 'mongoose';

/**
 * Renderiza la vista de todos los tracks
 * 
 * @param req 
 * @param res 
 */
export async function renderTracks(req: Request, res: Response) {
    res.render('tracks/list', {
        title: 'Canciones',
        tracks: await Track.find().populate('artistId', 'name', Artist).lean(),
        roles: {
            admin: await User.isAdmin(req.session.user),
            artist: await User.isArtist(req.session.user),
            user: await User.isUser(req.session.user)
        }
    });
}

/**
 * Renderiza la vista para crear un track nuevo
 * 
 * @param req 
 * @param res 
 */
export async function renderNewTrack(req: Request, res: Response) {
    res.render('tracks/new', {
        title: 'Nueva Canción',
        roles: {
            admin: await User.isAdmin(req.session.user),
            artist: await User.isArtist(req.session.user),
            user: await User.isUser(req.session.user)
        }
    });
}

/**
 * Guardar una nueva canción en la base de datos incluyendo el archivo de audio
 * que se guardará en el bucket de MongoDB.
 * 
 * @param req 
 * @param res 
 */
export async function newTrack(req: Request, res: Response) {
    const storage: StorageEngine = multer.memoryStorage();
    const upload: Multer = multer({
        storage,
        limits: {
            fields: 4, // Form fields limit
            fileSize: 1024 * 1024 * 12, // File size limit, default is 12MB
            files: 1, // Files limit
            parts: 5 // Parts limit, fields + files
        }
    })

    upload.single('trackfile')(req, res, async (err) => {
        if (err) {
            logger.error(`Error al subir el archivo: ${err}`);
            return undefined;
        }

        // Desestructurar el body
        const { title, duration, artist, terms } = req.body;

        const readableTrackStream = new Readable();
        readableTrackStream.push(req?.file?.buffer);
        readableTrackStream.push(null);

        let bucket = getBucket('track');

        // Obtener el nomnbre del archivo
        let fileName = req.file?.originalname != undefined ? req.file.originalname : `${title}.mp3`;

        // Subir el archivo al bucket
        let uploadStream = bucket.openUploadStream(fileName);

        // Obtener el id del archivo
        let fileId = uploadStream.id;

        // Pasar el uploadStream a readableTrackStream para que se suba al bucket
        readableTrackStream.pipe(uploadStream);

        uploadStream.on('error', (err) => {
            logger.error(`Error al subir el archivo: ${err}`);
            return undefined;
        });

        uploadStream.on('finish', async () => {
            logger.info(`Archivo subido con éxito: ${fileName}`);
            // Buscar el artista en la base de datos
            const artistFound = await Artist.findOne({ name: artist });
            const newArtist = artistFound != undefined ? artistFound : new Artist({ name: artist, userId: req.session.user._id });

            // Crear el track
            const newTrack = new Track({
                name: title,
                duration: parseInt(duration),
                artistId: new mongo.ObjectId(newArtist._id),
                trackFileId: fileId
            });

            // Guardar el artista
            await newArtist.save();
            logger.info(`Artista guardado con éxito: ${artist}`);

            // Guardar el track
            await newTrack.save();
            logger.info(`Track guardado con éxito: ${newTrack.name}`);

            res.redirect('/tracks');
            return fileId;
        });

    });
}

/**
 * Envia el archivo de audio al cliente para que lo reproduzca en el navegador.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export function streamTrackFile(req: Request, res: Response) {
    // Get the track file id from the url
    const { id } = req.params;

    // Cast the id to ObjectId
    try {
        new mongo.ObjectId(id);
    } catch (err) {
        return res.status(400).json({ message: 'Invalid track file id' });
    }

    res.set('Content-Type', 'audio/mp3');
    res.set('Acept-Ranges', 'bytes');

    let bucket = getBucket('track');

    let downloadStream = bucket.openDownloadStream(new mongo.ObjectId(id));

    downloadStream.on('data', (chunk) => {
        res.write(chunk);
    });

    downloadStream.on('end', () => {
        res.end();
    });

    downloadStream.on('error', (err) => {
        logger.error(`Error al descargar el archivo: ${err}`);
        res.status(500).json({ message: err.message });
    });

}