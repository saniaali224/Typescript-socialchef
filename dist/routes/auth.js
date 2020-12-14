"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
// import {loginValidation} from '../middlewares/validations';
const auth = (app) => {
    const prefix = '/auth';
    app.post(prefix + '/signUp', auth_1.signUp);
    app.post(prefix + '/login', auth_1.login);
};
exports.default = auth;
