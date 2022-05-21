import { Schema, model, Document } from 'mongoose';

export interface IPlaylist extends Document {
    name: string;
    description?: string;
    userId: Schema.Types.ObjectId | string;
    totalDuration?: number;
    totalTracks?: number;
    tracks?: Array<Schema.Types.ObjectId | string>;
}

const PlaylistSchema = new Schema<IPlaylist>({
    name: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalDuration: { type: Number, required: false, default: 0 },
    totalTracks: { type: Number, required: false, default: 0 },
    tracks: [
        { type: Schema.Types.ObjectId, ref: 'Track', required: false, default: [] }
    ]
}, { timestamps: true });

export default model<IPlaylist>('Playlist', PlaylistSchema);
