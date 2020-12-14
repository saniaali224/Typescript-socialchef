import mongoose, { Schema, Document } from 'mongoose';
import { date } from '@hapi/joi';

export interface Iadmin extends Document {
  name: string;
  userName: string;
  password: string;
  status: Boolean;
  lastLogin: Date
}

const superAdmin: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean },
  lasLogin: { type: Date }


});

// Export the model and return interface
export default mongoose.model<Iadmin>('superAdmin', superAdmin);