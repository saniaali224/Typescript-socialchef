"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const index = (app) => {
    app.get('/', (req, res) => {
        return res.json({ message: 'hello' });
    });
};
const allRoutes = (app) => {
    return {
        root: index(app),
        auth: auth_1.default(app),
    };
};
exports.default = allRoutes;
