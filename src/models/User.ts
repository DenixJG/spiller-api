import { Schema, Model, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, requiresd: true, unique: true },
    password: { type: String, required: true },
    roles: [
        { type: Schema.Types.ObjectId, ref: 'Role' }
    ]
}, { timestamps: true });

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    roles: Array<Schema.Types.ObjectId>
}

/**
 * Modelo de usuario.
 */
export interface UserModel extends Model<IUser> {
    encryptPassword: (password: string) => Promise<string>;
    comparePassword: (password: string, hash: string) => Promise<boolean>;
}

/**
 * Encripta la clave.
 * 
 * @param password La clave que se desea encriptar.
 * @returns La clave encriptada.
 */
UserSchema.statics.encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/**
 * Compara la clave con la clave encriptada.
 * 
 * @param password La cla que se desea comparar
 * @param hash La clave encriptada
 * @returns True si las claves coinciden, false en caso contrario.
 */
UserSchema.statics.comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}

export default model<IUser, UserModel>('User', UserSchema);