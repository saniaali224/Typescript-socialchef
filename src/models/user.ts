import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {
    userName: string;
    password: string;
    email: string,
    profileName: string
    userType: string
}

const user: Schema = new Schema({
    profileName: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    userType:{
        type: String,
        default:'user'
    }



});

// Export the model and return interface
export default mongoose.model<IUser>('superAdmin', user);