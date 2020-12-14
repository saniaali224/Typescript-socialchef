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
exports.editPurchaseInvoice = exports.allPurchaseInvoices = exports.allSaleInvoices = exports.returnProducts = exports.findInvoice = exports.createInvoice = void 0;
const franchise_product_1 = __importDefault(require("../models/franchise-product"));
const invoiceDetails_1 = __importDefault(require("../models/invoiceDetails"));
const invoice_1 = __importDefault(require("../models/invoice"));
const supplier_1 = __importDefault(require("../models/supplier"));
const franchise_product_2 = __importDefault(require("../models/franchise-product"));
/*
*** Api for creating a invoice***
*/
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        if (!req.body.products && !Array.isArray(req.body.products)) {
            return res.status(400).json({ msg: 'NO prodcuts or products is not an array' });
        }
        const invoice = yield invoice_1.default.create({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            customer: req.body.customerType,
            netTotal: req.body.netTotal,
            paid: req.body.paid,
            type: 'sale'
        });
        if (!invoice) {
            return res.status(400).json({ msg: 'sale invoice not created' });
        }
        let total = 0;
        const mappedProducts = req.body.products.map((p) => {
            total = total + p.price * p.quantity;
            return {
                invoiceId: invoice.id,
                franchiseProductId: p.productId,
                date: req.body.date,
                billType: req.body.billType,
                paymentMethod: req.body.paymentMethod,
                unitPrice: p.unitPrice,
                quantity: p.quantity,
                type: 'sale'
            };
        });
        const invoiceDetails = yield invoiceDetails_1.default.insertMany(mappedProducts);
        res.status(200).json({
            msg: 'Invoice Created', totalPrice: total, GST: '17%',
            grandTotal: (17 / 100 * total) + total,
            invoice: invoiceDetails
        });
        mappedProducts.map((p) => __awaiter(void 0, void 0, void 0, function* () {
            yield franchise_product_1.default.updateOne({
                _id: p.franchiseProductId
            }, {
                $inc: { quantity: -p.quantity }
            });
        }));
    }
    catch (error) {
        console.log('error:::::', error);
        res.status(500).json({ msg: error.message });
    }
});
exports.createInvoice = createInvoice;
/*
*** Api for finding an invoice***
*/
const findInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        if (!req.body.invoiceId) {
            return res.status(400).json({ msg: 'must provide invoice id' });
        }
        var invoice = yield invoiceDetails_1.default.find({
            invoiceId: req.body.invoiceId
        }).populate({ path: 'invoiceId', populate: { path: 'supplierId', select: 'firstName' } }).populate({ path: 'franchiseProductId', select: '_id productId', populate: { path: 'productId', select: 'name _id' } });
        if (!invoice[0]) {
            return res.status(404).json({ msg: 'No invoice found' });
        }
        const suppliers = yield supplier_1.default.find({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            isDeleted: false
        }, '_id firstName companyName address contactNo franchiseId');
        var outData = {
            suppliers: {
                _id: invoice[0].invoiceId.supplierId.id,
                firstName: invoice[0].invoiceId.supplierId.firstName
            },
            invoiceNo: invoice[0].invoiceId.invoiceNo,
            netTotal: invoice[0].invoiceId.netTotal,
            paid: invoice[0].invoiceId.paid,
            date: invoice[0].date,
            paymentMethod: invoice[0].paymentMethod,
            billType: invoice[0].billType,
        };
        var obj = invoice.map((p) => {
            var obj1 = Object.assign({}, p._doc);
            delete obj1.invoiceId;
            obj1.productName = obj1.franchiseProductId.productId.name;
            obj1.productId = obj1.franchiseProductId.productId.id;
            delete obj1.franchiseProductId;
            return obj1;
        });
        res.status(200).json({ msg: 'Invoice found', outDetails: outData, invoice: obj, suppliers: suppliers });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.findInvoice = findInvoice;
/*
*** Api for returning a purchased product***
*/
const returnProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (!storeUser) {
            return res.status(401).json({ msg: 'No user found' });
        }
        if (storeUser.role.roleName !== 'franchise admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        if (!req.body.invoiceId || !req.body.products) {
            return res.status(400).json({ msg: 'must provide all fields' });
        }
        if (Array.isArray(req.body.products)) {
            return res.status(400).json({ msg: 'prodcuts is not an array' });
        }
        const invoice = yield invoice_1.default.findOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.franchiseId.id,
            _id: req.body.invoiceId
        });
        if (!invoice) {
            return res.status(404).json({ msg: 'No invoice found' });
        }
        res.status(200).json({ msg: 'Invoice found and items returned' });
        req.body.products.map((p) => {
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.returnProducts = returnProducts;
/*
*** Api for viewing all sale invoices of a fracnhise ***
*/
const allSaleInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const invoice = yield invoice_1.default.find({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            type: 'sale'
        }, 'createdAt invoiceNo netTotal paid customer franchiseId');
        if (!invoice[0]) {
            return res.status(404).json({ msg: 'No invoice found' });
        }
        res.status(200).json({ msg: 'Invoice found', invoices: invoice });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.allSaleInvoices = allSaleInvoices;
/*
*** Api for viewing all purchase invoices of a fracnhise ***
*/
const allPurchaseInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const invoice = yield invoice_1.default.find({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            type: 'purchase'
        }, 'createdAt invoiceNo netTotal paid supplierId franchiseId').populate('supplierId');
        if (!invoice[0]) {
            return res.status(404).json({ msg: 'No invoice found' });
        }
        res.status(200).json({ msg: 'Invoice found', invoices: invoice });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.allPurchaseInvoices = allPurchaseInvoices;
/*
*** Api for editing a invocie of a fracnhise ***
*/
const editPurchaseInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        if (!req.body.invoiceId) {
            return res.status(400).json({ msg: 'must provide invoice id' });
        }
        const deletedInvoice = yield invoice_1.default.deleteOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            _id: req.body.invoiceId
        });
        const deletedDetails = yield invoiceDetails_1.default.deleteMany({ invoiceId: req.body.invoiceId });
        const invoice = yield invoice_1.default.create({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            supplierId: req.body.supplierId ? req.body.supplierId : null,
            netTotal: req.body.netTotal,
            paid: req.body.paid,
            type: 'purchase'
        });
        if (!invoice) {
            return res.status(400).json({ msg: 'purchase invoice not created' });
        }
        yield franchise_product_2.default.deleteMany({ invoiceId: req.body.invoiceId });
        const franchiseProduct = req.body.products.map((p) => __awaiter(void 0, void 0, void 0, function* () {
            return yield franchise_product_2.default.create({
                storeId: storeUser.storeId.id,
                franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
                supplierId: req.body.supplierId,
                productId: p.productId,
                invoiceId: invoice.id,
                unitPrice: p.unitPrice,
                quantity: p.quantity
            });
        }));
        Promise.all(franchiseProduct).then((...args) => __awaiter(void 0, void 0, void 0, function* () {
            const newProducts = args[0].map((p) => {
                return {
                    invoiceId: invoice.id,
                    franchiseProductId: p.id,
                    date: req.body.date,
                    billType: req.body.billType,
                    paymentMethod: req.body.paymentMethod,
                    unitPrice: p.unitPrice,
                    quantity: p.quantity
                };
            });
            const invoiceDetails = yield invoiceDetails_1.default.insertMany(newProducts);
            res.status(200).json({ msg: 'Products edited' });
        })).catch(error => {
            return res.status(500).json({ msg: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.editPurchaseInvoice = editPurchaseInvoice;
