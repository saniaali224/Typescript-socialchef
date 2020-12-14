"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const franchiseProduct_1 = require("../controllers/franchiseProduct");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const validations_1 = require("../middlewares/validations");
const franchiseProduct = (app) => {
    const prefix = '/franchiseproduct';
    app.post(prefix + '/addproduct', verify_middleware_1.default, softDelete_1.default, franchiseProduct_1.addProduct);
    app.post(prefix + '/findfranchiseproduct', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, franchiseProduct_1.findFranchiseProductById);
    app.post(prefix + '/findproduct', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, franchiseProduct_1.findStoreProductById);
    app.post(prefix + '/findfranchiseproducts', verify_middleware_1.default, softDelete_1.default, franchiseProduct_1.findFranchiseAllproducts);
    app.get(prefix + '/findstoreproducts', verify_middleware_1.default, softDelete_1.default, franchiseProduct_1.findStoreAllProducts);
    app.post(prefix + '/deletefranchiseproduct', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, franchiseProduct_1.deleteFranchiseProduct);
    app.post(prefix + '/deletestoreproduct', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, franchiseProduct_1.deleteStoreProduct);
};
exports.default = franchiseProduct;
