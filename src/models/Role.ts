import { Schema, Model, Document, model } from 'mongoose';

export const ROLES = ['admin', 'user', 'artist']

const RoleSchema = new Schema({
    name: { type: String }
})

export interface IRole extends Document{
    name: string
}

export default model<IRole>('Role', RoleSchema);
