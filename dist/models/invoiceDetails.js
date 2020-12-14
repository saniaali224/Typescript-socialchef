"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const invoiceDetails = new mongoose_1.Schema({
    invoiceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'invoice',
        required: true
    },
    franchiseProductId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'franchise-product',
        required: true
    },
    date: { type: Date },
    billType: { type: String },
    paymentMethod: { type: String },
    quantity: { type: Number },
    unitPrice: { type: Number },
    type: { type: String }
}, { timestamps: true });
// Export the model and return interface
exports.default = mongoose_1.default.model('invoice-details', invoiceDetails);
