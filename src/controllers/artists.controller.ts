import { Request, Response } from 'express';
import { mongo } from 'mongoose';
import logger from '../libs/logger';

import Artist, { IArtist } from '../models/Artist';
import Role from '../models/Role';
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
                artist: artist
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

        // Find by name an artist
        const artist: IArtist | null = await Artist.findOne({ name });

        // If artist exists
        if (artist) {
            // If the artist is not the user
            if (artist.userId.toString() !== userId) {
                req.flash('warning_msg', 'El artista ya existe');
                return;
            }
        }

        // Separate genres by comma and trim spaces.
        const genresArray = genres.split(',').map((genre: string) => genre.trim());

        // Create new artist
        const newArtist = new Artist({
            name: name,
            genres: genresArray,
            userId: new mongo.ObjectId(userId)
        });

        // Get the role for artist       
        const role = await Role.findOne({ name: { $in: ['artist'] } });

        // Save artist
        await newArtist.save();

        // Set the role for the user
        const user: IUser | null = await User.findByIdAndUpdate(userId, { $set: { roles: new mongo.ObjectId(role?._id) } });

        // TODO: Reiniciar los roles de las variables globales

        // Redirect to profile
        req.flash('success_msg', 'Ahora eres un artista, en el proximo inicio de sesión podras subir canciones!');
        res.redirect('/profile');

    } catch (error) {
        logger.error(error);
        req.flash('error_msg', 'Error al crear el artista');
        res.redirect('/profile');
    }
}
