"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const jwt_1 = require("../utitly/jwt");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield new user_1.default({
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            profileName: req.body.profileName
        });
        user.save().then((result) => {
            const token = jwt_1.jwt(user);
            return res.status(200).json({ msg: 'signUp successfull', token: token, user: result });
        }).catch((err) => {
            return res.status(404).json({ msg: 'signUp unsuccessfull', err });
        });
    }
    catch (error) {
        console.log('eror::::', error);
        res.status(404).json({ msg: error.message });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.storeId || !req.body.email || !req.body.password) {
            return res.status(403).json({ msg: 'fields Missing' });
        }
        const user = yield user_1.default.findOne({
            userName: req.body.userName,
        });
        if (!user) {
            return res.status(404).json({ msg: 'No user found' });
        }
        const isEqual = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isEqual) {
            return res.status(401).json({ msg: 'Wrong password' });
        }
        const token = jwt_1.jwt(user);
        return res.status(200).json({ msg: 'login successfull', token: token, user: user });
    }
    catch (error) {
        console.log('eror::::', error);
        res.status(404).json({ msg: error.message });
    }
});
exports.login = login;
