import mongoose, { Schema, Document } from 'mongoose';


export interface Istore extends Document {
  storeName: string;
  domain: string;
  isDeleted: Boolean;
  ownerName: string;
  slogan: string;
  storeAddress: string;
  phone: string;
  email: string;
}

const store: Schema = new Schema({
  storeName: { type: String, required: true, unique: true },
  domain: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  ownerName: { type: String },
  phone: { type: String },
  slogan: { type: String },
  storeAddress: { type: String },
  email: { type: String }
}, { timestamps: true });

// Export the model and return interface
export default mongoose.model<Istore>('store', store);