import { Schema, model, Document } from 'mongoose';

/**
 * Interfaz de un Record Company.
 */
export interface IRecordCompany extends Document {
    name: string;
    totalArtists: number;
    artists: Array<Schema.Types.ObjectId | string>;
    tracks: Array<Schema.Types.ObjectId | string>;
}

/**
 * Esquema de RecordCompany, define la estrucutra de un RecordCompany en la base de datos.
 */
const RecordCompanySchema = new Schema<IRecordCompany>({
    name: { type: String, required: true },
    totalArtists: { type: Number, required: true },
    artists: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    tracks: { type: Schema.Types.ObjectId, ref: 'Track', required: true }
}, { timestamps: true });

export default model<IRecordCompany>('RecordCompany', RecordCompanySchema);