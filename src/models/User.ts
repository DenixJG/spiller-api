import { Schema, Model, Document, model } from 'mongoose';

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

export default model<IUser>('User', UserSchema);