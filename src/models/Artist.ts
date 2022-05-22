import { Schema, model, Document } from 'mongoose';

/**
 * Interfaz de artista.
 */
export interface IArtist extends Document {
    name: string;
    genres: Array<String>;
    userId: Schema.Types.ObjectId | string;
}

/**
 * Esquema de artista, define la estrucutra de un artista en la base de datos.
 */
const ArtistScheme = new Schema<IArtist>({
    name: { type: String, required: true, unique: true },
    genres: [
        { type: String, required: false }
    ],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });


export default model<IArtist>('Artist', ArtistScheme);
