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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminJwt = exports.jwt = void 0;
const JWT = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt = (user) => {
    return JWT.sign({
        userId: user.id,
        email: user.email,
        userType: user.userType
    }, `${process.env.jwtSecret}`, { expiresIn: 300 * 300 });
};
exports.jwt = jwt;
const adminJwt = (user) => {
    return JWT.sign({
        storeId: user.storeId.id,
        userId: user.id,
        email: user.email,
        roleId: user.role.id
    }, `${process.env.jwtSecret}`, { expiresIn: 300 * 300 });
};
exports.adminJwt = adminJwt;
