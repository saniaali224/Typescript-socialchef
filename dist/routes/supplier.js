"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplier_1 = require("../controllers/supplier");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const supplier = (app) => {
    const prefix = '/supplier';
    app.get(prefix + '/viewsuppliers', verify_middleware_1.default, softDelete_1.default, supplier_1.storeSuppliers);
    app.post(prefix + '/viewfranchisesuppliers', verify_middleware_1.default, softDelete_1.default, supplier_1.franchiseSuppliers);
    app.post(prefix + '/addfranchisesupplier', verify_middleware_1.default, softDelete_1.default, supplier_1.addSupplier);
    app.post(prefix + '/deletesupplier', verify_middleware_1.default, softDelete_1.default, supplier_1.deleteSupplier);
    app.post(prefix + '/editsupplier', verify_middleware_1.default, softDelete_1.default, supplier_1.editSupllier);
};
exports.default = supplier;
