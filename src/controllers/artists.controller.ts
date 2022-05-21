import { Request, Response } from 'express';
import { mongo } from 'mongoose';
import logger from '../libs/logger';

import Artist, { IArtist } from '../models/Artist';
import Role from '../models/Role';
import User, { IUser } from '../models/User';

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

        // Redirect to profile
        req.flash('success_msg', 'Ahora eres un artista, en el proximo inicio de sesión podras subir canciones!');
        res.redirect('/profile');

    } catch (error) {
        logger.error(error);
        req.flash('error_msg', 'Error al crear el artista');
        res.redirect('/profile');
    }


}
