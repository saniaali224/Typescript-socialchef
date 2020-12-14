import mongoose, { Schema, Document } from 'mongoose';


export interface Irole extends Document {
    roleName: string;
    features: any;
}

const role: Schema = new Schema({
    roleName: { type: String, required: true },
    features: [{ type: String, required: true }],
}, { timestamps: true });

// Export the model and return interface
export default mongoose.model<Irole>('role', role);