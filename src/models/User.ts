import { Schema, Model, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Role from './Role';

/**
 * Esquema de usuario, define la estrucutra de un usuario en la base de datos.
 */
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, requiresd: true, unique: true },
    password: { type: String, required: true },
    roles: [
        { type: Schema.Types.ObjectId, ref: 'Role' }
    ]
}, { timestamps: true });

/**
 * Interfaz de usuario.
 */
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
    isAdmin: (user: IUser) => Promise<boolean>;
    isArtist: (user: IUser) => Promise<boolean>;
    isUser: (user: IUser) => Promise<boolean>;
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
 * @param password La clave que se desea comparar
 * @param hash La clave encriptada
 * @returns True si las claves coinciden, false en caso contrario.
 */
UserSchema.statics.comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}

/**
 * Comprueba si el rol del usuario es 'admin'.
 * 
 * @param user Usuario que se desea comprobar.
 * @returns True si el usuario es 'admin', false en caso contrario.
 */
UserSchema.statics.isAdmin = async (user: IUser) => {
    if (!user) { return false; }
    const roles = await Role.find({ _id: { $in: user.roles } });
    return roles.some(role => role.name === 'admin');
}

/**
 * Comprueba si el rol del usuario es 'artist'.
 * 
 * @param user Ususario que se desea comprobar si es artista.
 * @returns True si el usuario es 'artist', false en caso contrario.
 */
UserSchema.statics.isArtist = async (user: IUser) => {
    if (!user) { return false; }
    const roles = await Role.find({ _id: { $in: user.roles } });
    return roles.some(role => role.name === 'artist');
}

/**
 * Comprueba si el rol del usuario es 'user'.
 * 
 * @param user Usuario que se desea comprobar si es usuario.
 * @returns True si el usuario es 'user', false en caso contrario.
 */
UserSchema.statics.isUser = async (user: IUser) => {
    if (!user) { return false; }
    const roles = await Role.find({ _id: { $in: user.roles } });
    return roles.some(role => role.name === 'user');
}

export default model<IUser, UserModel>('User', UserSchema);
