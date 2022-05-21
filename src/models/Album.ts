import { Schema, model, Document } from 'mongoose';

export interface IAlbum extends Document {
    name: string;
    releaseDate: Date;
    totalTracks: number;
    artistId: Array<Schema.Types.ObjectId | string>;
    tracks: Array<Schema.Types.ObjectId | string>;
    isSingle: boolean;
}

const AlbumSchema = new Schema<IAlbum>({
    name: { type: String, required: true },
    releaseDate: { type: Date, required: true, default: new Date() },
    totalTracks: { type: Number, required: true },
    artistId: [
        { type: Schema.Types.ObjectId, ref: 'Artist', required: true }
    ],
    tracks: [
        { type: Schema.Types.ObjectId, ref: 'Track', required: true, }
    ],
    isSingle: { type: Boolean, required: true }
}, { timestamps: true });

export default model<IAlbum>('Album', AlbumSchema);
