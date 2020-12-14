"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storeUser_1 = require("../controllers/storeUser");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const storeUser = (app) => {
    const prefix = '/storeuser';
    app.post(prefix + '/addstoreuser', verify_middleware_1.default, softDelete_1.default, storeUser_1.addStoreUser);
    app.post(prefix + '/deletestoreuser', verify_middleware_1.default, softDelete_1.default, storeUser_1.deleteStoreUser);
    app.post(prefix + '/findallstoreusers', verify_middleware_1.default, softDelete_1.default, storeUser_1.findStoreUsers);
    app.post(prefix + '/findfranchisestoreusers', verify_middleware_1.default, softDelete_1.default, storeUser_1.findFranchiseStoreUsers);
    app.post(prefix + '/findrolestoreusers', verify_middleware_1.default, softDelete_1.default, storeUser_1.findRoleStoreUsers);
    app.post(prefix + '/edituser', verify_middleware_1.default, softDelete_1.default, storeUser_1.editStoreUser);
};
exports.default = storeUser;
