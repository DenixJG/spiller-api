import { Request, Response } from 'express';
import { mongo, MongooseError, Schema } from 'mongoose';
import logger from '../libs/logger';
import Playlist, { IPlaylist } from '../models/Playlist';
import Track, { ITrack } from '../models/Track';

export async function renderPlaylists(req: Request, res: Response) {
    res.render('playlist/list', {
        title: 'Tus playlists',
        playlists: await Playlist.find({ userId: req.userId }).lean()
    });
}

export async function renderViewPlaylist(req: Request, res: Response) {
    try {
        const id = new mongo.ObjectId(req.params.id);

        res.render('playlist/view', {
            title: 'Playlist',
            playlist: await Playlist.findById(id).lean()
        });

    } catch (error) {
        req.flash('warning_msg', 'Playlist no encontrada');
        res.redirect('/profile/playlists');
    }

}

export function renderNewPlaylist(req: Request, res: Response) {
    res.render('playlist/new', {
        title: 'Crear playlist',
    });
}

export async function createPlaylist(req: Request, res: Response) {
    try {
        // Desestrucutrar el body
        const { name, description, userId } = req.body;

        // Crear el objeto
        const playlist: IPlaylist = new Playlist({
            name: name,
            description: description,
            userId: userId
        });

        // Guardar el objeto
        const savedPlaylist = await playlist.save();

        if (savedPlaylist) {
            req.flash('success_msg', 'Playlist creada');
            res.redirect('/profile/playlists');
        } else {
            throw new Error('Playlist no creada');
        }

    } catch (error) {
        logger.error(`Error al crear playlist: ${error}`);
        req.flash('warning_msg', 'Error al crear playlist');
        res.redirect('/profile/playlists/new');
    }
}

export async function addTrackToPlaylist(req: Request, res: Response) {

    try {
        const { playlistId, trackId } = req.body;

        // Comprobar si 'playlistId' es un array
        if (Array.isArray(playlistId)) {
            playlistId.forEach(async (id: string) => {
                await addToPlaylist(id, trackId, req, res);
            });
            req.flash('success_msg', 'Tracks agregado a las playlists');
            res.redirect('/tracks');
        } else {
            await addToPlaylist(playlistId, trackId, req, res);
            req.flash('success_msg', 'Track agregado a la playlist');
            res.redirect('/tracks');
        }

    } catch (error) {
        logger.error(`Error al agregar track a playlist: ${error}`);
        req.flash('error_msg', `${error}`);
    }
}

/**
 * Agrega un track a una playlist especifica.
 * 
 * @param playlistId El id de la playlist.
 * @param trackId El id del track a agregar.
 * @param req 
 * @param res 
 */
async function addToPlaylist(playlistId: any, trackId: any, req: Request, res: Response) {
    const playlist = await Playlist.findById(playlistId);

    if (playlist) {
        if (playlist?.tracks?.indexOf(trackId) === -1) {
            // Agregar el track a la playlist y guardar el total de tracks
            playlist.totalTracks = playlist.tracks.push(trackId);

            // Obtener el track para saber su duracion
            const track = await Track.findById(trackId);

            // Si el track existe, sumar la duracion
            if (track) {
                if (playlist.totalDuration) {
                    playlist.totalDuration += track.duration;
                } else {
                    playlist.totalDuration = track.duration;
                }
            }

            await playlist.save();
        } else {
            throw new Error('El track ya existe en la playlist');
        }

    } else {
        throw new Error('Playlist no encontrada');
    }
}

