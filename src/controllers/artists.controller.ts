import { Request, Response } from 'express';
import { mongo } from 'mongoose';
import logger from '../libs/logger';
import Album from '../models/Album';

import Artist, { IArtist } from '../models/Artist';
import Playlist from '../models/Playlist';
import Role from '../models/Role';
import Track from '../models/Track';
import User, { IUser } from '../models/User';

export async function renderViewArtist(req: Request, res: Response) {
    try {
        // Obtener el id del artista desde la url
        const artistId = req.params.id;

        // Comprobar que el id del artista es un ObjectId valido
        new mongo.ObjectId(artistId);

        // Buscar el artista en la base de datos
        const artist = await Artist.findById(artistId).lean();       

        if (artist) {
            res.render('artists/view', {
                title: 'Artista - ' + artist.name,
                artist: artist,
                albums: await Album.find({ artistId: artistId }).lean(),
                tracks: await Track.find({ artistId: artistId }).populate('artistId', 'name', Artist).sort({ createdAt: -1 }).limit(5).lean(),
                playlists: await Playlist.find({ userId: req?.session?.user?._id }).lean()
            });
        } else {
            req.flash('warning_msg', 'El artista no existe');
            res.redirect('/tracks');
        }

    } catch (error) {
        logger.error(`Error al intentar obtener el artista con id: ${req.params.id}`);
        req.flash('error_msg', 'Error al intentar obtener el artista');
        res.redirect('/tracks');
    }

}

/**
 * Crea un nuevo artista, recibe un objeto con los datos del artista para 
 * crearlo en la base de datos y asignar al usuario que lo creó el rol de
 * artista, guarda en el objeto de `artist` el id del usuario que lo creó.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function createNewArtist(req: Request, res: Response) {
    try {
        // Desestructurar el body
        const { name, genres, userEmail, userId } = req.body;

        // Buscar segun el nombre del artista
        const artist: IArtist | null = await Artist.findOne({ name });

        // Si el artista existe
        if (artist) {
            // Si el artista no es el usuario
            if (artist.userId.toString() !== userId) {
                req.flash('warning_msg', 'El artista ya existe');
                return;
            }
        }

        // Separar generos por comas
        const genresArray = genres.split(',').map((genre: string) => genre.trim());

        // Crear un nuevo artistas
        const newArtist = new Artist({
            name: name,
            genres: genresArray,
            userId: new mongo.ObjectId(userId)
        });

        // Obtener el rol del artista       
        const role = await Role.findOne({ name: { $in: ['artist'] } });

        // Guardar el artista
        await newArtist.save();

        // Establecer el rol al usuario
        const user: IUser | null = await User.findByIdAndUpdate(userId, { $set: { roles: new mongo.ObjectId(role?._id) } });

        // TODO: Reiniciar los roles de las variables globales

        // Redirigir al perfil
        req.flash('success_msg', 'Ahora eres un artista, en el proximo inicio de sesión podras subir canciones!');
        res.redirect('/profile');

    } catch (error) {
        logger.error(error);
        req.flash('error_msg', 'Error al crear el artista');
        res.redirect('/profile');
    }
}
