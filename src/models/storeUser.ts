import mongoose, { Schema, Document } from 'mongoose';


export interface IstoreUser extends Document {
    storeId: Schema.Types.ObjectId;
    franchiseId: Schema.Types.ObjectId;
    role: Schema.Types.ObjectId;
    fistName: string;
    lastName: string;
    email: string;
    address: string;
    password: string;
    phone: string;
    isDeleted: boolean;
}

const storeUser: Schema = new Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    franchiseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchise'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: { type: String },
    email: { type: String, required: true},
    password: {
        type: String,
        required: true
    },
    address: { type: String },
    phone: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// Export the model and return interface
export default mongoose.model<IstoreUser>('storeUser', storeUser);