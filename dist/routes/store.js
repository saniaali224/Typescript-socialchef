"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../controllers/store");
const validations_1 = require("../middlewares/validations");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const store = (app) => {
    const prefix = '/store';
    app.post(prefix + '/createstore', validations_1.signupValidation, store_1.createStore);
    app.post(prefix + '/deletestore', validations_1.idValidation, store_1.deleteStore);
    app.post(prefix + '/findstore', store_1.findStore);
    app.post(prefix + '/allstores', store_1.allStores);
    app.get(prefix + '/allstoresandfranchises', store_1.allStoresAndFranchises);
    app.post(prefix + '/editstore', verify_middleware_1.default, softDelete_1.default, store_1.settings);
    app.get(prefix + '/getstore', verify_middleware_1.default, softDelete_1.default, store_1.getSetting);
};
exports.default = store;
