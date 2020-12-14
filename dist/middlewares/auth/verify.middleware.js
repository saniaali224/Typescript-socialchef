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
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = __importStar(require("jsonwebtoken"));
const verify = (req, res, next) => {
    let authentication = req.headers.authorization;
    if (authentication) {
        let accessToken = authentication.split(' ')[1];
        JWT.verify(accessToken, `${process.env.jwtSecret}`, (err, decode) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.body.user = decode;
            next();
        });
    }
    else {
        return res.status(401).json({ message: 'No token supplied' });
    }
};
exports.default = verify;
