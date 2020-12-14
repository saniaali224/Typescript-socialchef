import mongoose, { Schema, Document } from 'mongoose';


export interface Iproducts extends Document {
    storeId: mongoose.Types.ObjectId;
    name: string;
    productCode: string;
    category: Schema.Types.ObjectId;
    subCategory: string;
    costPrice: Number;
    minimumRetailPrice: Number;
    productTax: Number;
    unit: Number;
    status: string;
    description: string;
    openingStock: Number;
    imageField: string;
    minimumQuantity: Number;
    maximumQuantity: Number;

}

const products: Schema = new Schema({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    productCode: { type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    costPrice: { type: Number },
    minimumRetailPrice: { type: Number },
    productTax: { type: Number },
    unit: { type: Number },
    status: { type: String },
    description: { type: String },
    minimumQuantity: { type: Number },
    maximumQuantity: { type: Number },
    openingStock: { type: Number },
    imageField: { type: String }

}, { timestamps: true });

// Export the model and return interface
export default mongoose.model<Iproducts>('products', products);