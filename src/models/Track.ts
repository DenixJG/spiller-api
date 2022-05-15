import { Schema, model, Document } from 'mongoose';

export interface ITrack extends Document {
    name: string;
    duration: number;
    artistId: Schema.Types.ObjectId | string;
    trackFileId: Schema.Types.ObjectId | string;
}

const TrackSchema = new Schema<ITrack>({
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    trackFileId: { type: Schema.Types.ObjectId, ref: 'TrackFile', required: true }
});

export default model<ITrack>('Track', TrackSchema);
