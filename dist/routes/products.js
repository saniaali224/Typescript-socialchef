"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../controllers/products");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const validations_1 = require("../middlewares/validations");
const products = (app) => {
    const prefix = '/products';
    app.get(prefix + '/allproducts', verify_middleware_1.default, softDelete_1.default, products_1.viewProducts);
    app.post(prefix + '/addproduct', verify_middleware_1.default, softDelete_1.default, products_1.addGenericProduct);
    app.post(prefix + '/categoryproducts', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, products_1.viewProductsByCategory);
    app.post(prefix + '/editproduct', verify_middleware_1.default, softDelete_1.default, products_1.editGenericProduct);
};
exports.default = products;
