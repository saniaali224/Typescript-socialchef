"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_1 = require("../controllers/invoice");
const verify_middleware_1 = __importDefault(require("../middlewares/auth/verify.middleware"));
const softDelete_1 = __importDefault(require("../middlewares/auth/softDelete"));
const invoice = (app) => {
    const prefix = '/invoice';
    app.post(prefix + '/createinvoice', verify_middleware_1.default, softDelete_1.default, invoice_1.createInvoice);
    app.post(prefix + '/findinvoice', verify_middleware_1.default, softDelete_1.default, invoice_1.findInvoice);
    app.post(prefix + '/allsaleinvoices', verify_middleware_1.default, softDelete_1.default, invoice_1.allSaleInvoices);
    app.post(prefix + '/allpurchaseinvoices', verify_middleware_1.default, softDelete_1.default, invoice_1.allPurchaseInvoices);
    app.post(prefix + '/editinvoice', verify_middleware_1.default, softDelete_1.default, invoice_1.editPurchaseInvoice);
};
exports.default = invoice;
