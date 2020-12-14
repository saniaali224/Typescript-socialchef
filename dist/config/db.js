"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() {
        mongoose_1.default.connect(`${process.env.DB_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then((conn) => {
            console.log('connected to db');
        }).catch((error) => {
            console.log('error :::::', error);
        });
    }
}
exports.default = Database;
