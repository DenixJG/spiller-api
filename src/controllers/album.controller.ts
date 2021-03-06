import { Request, Response } from 'express';
import { mongo } from 'mongoose';
import logger from '../libs/logger';
import Album, { IAlbum } from '../models/Album';
import Playlist from '../models/Playlist';

/**
 * Renderiza la vista de detalles de un album.
 * 
 * @param req 
 * @param res 
 */
export async function renderViewAlbum(req: Request, res: Response) {
    try {
        const id = new mongo.ObjectId(req.params.id);

        res.render('album/view', {
            title: 'Album',
            album: await Album.findById(id).populate({
                path: 'artistId',
                options: { lean: true },
            }).populate({
                path: 'tracks',
                options: { lean: true },
                populate: {
                    path: 'artistId',
                    options: { lean: true },
                }
            }).lean(),
            playlists: await Playlist.find({ userId: req?.session?.user?._id }).lean(),
        });

    } catch (error) {
        logger.error(`Error al buscar album: ${error}`);
        req.flash('warning_msg', 'Album no encontrado');
        res.redirect('/');
    }

}

/**
 * Crea un nuevo album.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function createAlbum(req: Request, res: Response) {
    try {
        // Desestructurar los datos del body.
        const { name, releaseDate, artistId, tracks } = req.body;

        if (tracks.length === 0) {
            req.flash('warning_msg', 'No has agregado ninguna cancion');
            res.redirect('/profile');
            return;
        }

        // Crear un nuevo album.
        const album: IAlbum = new Album({
            name: name,
            releaseDate: new Date(releaseDate),
            totalTracks: Array.isArray(tracks) ? tracks.length : 1,
            artistId: artistId,
            tracks: tracks,
            isSingle: !Array.isArray(tracks)
        });

        // Guardar el album en la base de datos.
        const savedAlbum = await album.save();

        // Comrpobar si el album se guardo correctamente.
        if (savedAlbum) {
            req.flash('success_msg', 'Album creado correctamente');
            res.redirect('/profile');
        } else {
            req.flash('warning_msg', 'Algo salio mal');
            logger.error('Error al guardar el album en la base de datos');
            res.redirect('/profile');
        }

    } catch (error) {
        logger.error(`Error al crear el album: ${error}`);
        req.flash('warning_msg', 'Algo salio mal');
        res.redirect('/profile');
    }
}
