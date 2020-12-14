"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const report_1 = require("../controllers/report");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const report = (app) => {
    const prefix = '/report';
    app.get(prefix + '/stock', verify_middleware_1.default, softDelete_1.default, report_1.stockReport);
    app.get(prefix + '/sale', report_1.saleReport);
};
exports.default = report;
