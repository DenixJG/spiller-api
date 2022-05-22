import { Schema, Model, Document, model } from 'mongoose';


export const ROLES = ['admin', 'user', 'artist']

/**
 * Interfaz de rol.
 */
export interface IRole extends Document {
    name: string
}

/**
 * Esquema de rol, define la estrucutra de un rol en la base de datos.
 */
const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true, enum: ROLES }
}, { timestamps: true });

export default model<IRole>('Role', RoleSchema);
