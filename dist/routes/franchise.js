"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const franchise_1 = require("../controllers/franchise");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const validations_1 = require("../middlewares/validations");
const franchise = (app) => {
    const prefix = '/franchise';
    app.post(prefix + '/createfranchise', verify_middleware_1.default, softDelete_1.default, franchise_1.createFranchise);
    app.post(prefix + '/deletefranchise', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, franchise_1.deleteFranchise);
    app.get(prefix + '/findallfranchises', verify_middleware_1.default, softDelete_1.default, franchise_1.findFranchises);
    app.post(prefix + '/findfranchise', verify_middleware_1.default, softDelete_1.default, validations_1.idValidation, franchise_1.findFranchise);
    app.post(prefix + '/editfranchise', verify_middleware_1.default, softDelete_1.default, franchise_1.editFranchise);
};
exports.default = franchise;
