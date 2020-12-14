"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("../controllers/category");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const category = (app) => {
    const prefix = '/category';
    app.get(prefix + '/allcategories', verify_middleware_1.default, softDelete_1.default, category_1.allCategories);
    app.post(prefix + '/addcategory', verify_middleware_1.default, softDelete_1.default, category_1.createCategory);
    app.post(prefix + '/addsubcategory', verify_middleware_1.default, softDelete_1.default, category_1.addSubCategory);
    app.post(prefix + '/editcategory', verify_middleware_1.default, softDelete_1.default, category_1.editCategory);
};
exports.default = category;
