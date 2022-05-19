import { Request, Response } from 'express';
import { mongo } from 'mongoose';
import logger from '../libs/logger';
import Playlist, { IPlaylist } from '../models/Playlist';

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
