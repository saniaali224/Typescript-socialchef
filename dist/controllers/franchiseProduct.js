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
exports.updateFranchiseProduct = exports.findStoreAllProducts = exports.findFranchiseAllproducts = exports.findFranchiseProductById = exports.deleteStoreProduct = exports.deleteFranchiseProduct = exports.findStoreProductById = exports.addProduct = void 0;
const franchise_1 = __importDefault(require("../models/franchise"));
const franchise_product_1 = __importDefault(require("../models/franchise-product"));
const invoice_1 = __importDefault(require("../models/invoice"));
const invoiceDetails_1 = __importDefault(require("../models/invoiceDetails"));
/*
*** Api for adding products to a franchise***
*/
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        console.log('body::::', req.body);
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const existingFranchise = yield franchise_1.default.findOne({
            storeId: storeUser.storeId.id,
            _id: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            isDeleted: false
        });
        if (!existingFranchise) {
            return res.status(404).json({ msg: 'No frachise found to add product to' });
        }
        const invoice = yield invoice_1.default.create({
            storeId: storeUser.storeId.id,
            franchiseId: existingFranchise.id,
            supplierId: req.body.supplierId ? req.body.supplierId : null,
            netTotal: req.body.netTotal,
            paid: req.body.paid,
            type: 'purchase'
        });
        if (!invoice) {
            return res.status(400).json({ msg: 'purchase invoice not created' });
        }
        const franchiseProduct = req.body.products.map((p) => __awaiter(void 0, void 0, void 0, function* () {
            return yield franchise_product_1.default.create({
                storeId: storeUser.storeId.id,
                franchiseId: existingFranchise.id,
                supplierId: req.body.supplierId ? req.body.supplierId : null,
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
                    quantity: p.quantity,
                    type: 'purchase'
                };
            });
            const invoiceDetails = yield invoiceDetails_1.default.insertMany(newProducts);
            res.status(200).json({ msg: 'Products added' });
        })).catch(error => {
            return res.status(500).json({ msg: error.message });
        });
    }
    catch (error) {
        console.log('error:::::', error);
        res.status(500).json({ msg: error.message });
    }
});
exports.addProduct = addProduct;
/*
*** Api for finding a store product by product id**
*/
const findStoreProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        const product = yield franchise_product_1.default.findOne({
            storeId: storeUser.storeId.id,
            productId: req.body.id,
            quantity: { $gt: 0 }
        });
        if (!product) {
            return res.status(404).json({ msg: 'No product found' });
        }
        res.status(200).json({ msg: 'product found', product: product });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.findStoreProductById = findStoreProductById;
/*
*** Api for finding a franchise product by product id**
*/
const findFranchiseProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const product = yield franchise_product_1.default.findOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            productId: req.body.id,
            quantity: { $gt: 0 }
        });
        if (!product) {
            return res.status(404).json({ msg: 'No product found' });
        }
        res.status(200).json({ msg: 'product found', product: product });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.findFranchiseProductById = findFranchiseProductById;
/*
*** Api for finding all products of a franchise***
*/
const findFranchiseAllproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const product = yield franchise_product_1.default.find({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            quantity: { $gt: 0 }
        }).populate('productId');
        if (!product[0]) {
            return res.status(404).json({ msg: 'No product found' });
        }
        res.status(200).json({ msg: 'product found', product: product });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.findFranchiseAllproducts = findFranchiseAllproducts;
/*
*** Api for finding all products of a Store***
*/
const findStoreAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const product = yield franchise_product_1.default.find({
            storeId: storeUser.storeId.id,
            quantity: { $gt: 0 }
        });
        if (!product[0]) {
            return res.status(404).json({ msg: 'No product found' });
        }
        res.status(200).json({ msg: 'product found', product: product });
    }
    catch (error) {
        console.log('error:::::', error);
        res.status(500).json({ msg: error.message });
    }
});
exports.findStoreAllProducts = findStoreAllProducts;
/*
*** Api for deleting a product of a franchise***
*/
const deleteFranchiseProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const product = yield franchise_product_1.default.updateOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            _id: req.body.id,
            quantity: { $gt: 0 }
        }, {
            quantity: 0
        });
        if (product.nModified === 0) {
            return res.status(400).json({ msg: 'product not deleted' });
        }
        res.status(201).json({ msg: 'product deleted' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.deleteFranchiseProduct = deleteFranchiseProduct;
/*
*** Api for deleting a product of a store***
*/
const deleteStoreProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const product = yield franchise_product_1.default.updateMany({
            storeId: storeUser.storeId.id,
            productId: req.body.id,
            quantity: { $gt: 0 }
        }, {
            quantity: 0
        });
        if (product.nModified === 0) {
            return res.status(400).json({ msg: 'product not deleted' });
        }
        res.status(201).json({ msg: 'product deleted' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.deleteStoreProduct = deleteStoreProduct;
/*
*** Api for updating a product of a franchise***
*/
const updateFranchiseProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (!req.body.franchiseProductId) {
            return res.status(400).json({ msg: 'Must provide all fields' });
        }
        if (!storeUser) {
            return res.status(404).json({ msg: 'No store User found' });
        }
        if (storeUser.role.roleName !== 'store admin' && storeUser.role.roleName !== 'franchise admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        // const newFranchiseProduct: any = await FranchiseProduct.updateOne({
        //     storeId: storeUser.storeId.id,
        //     _id: req.body.franchiseProductId
        // }, {
        //     quantity ? (quantity : req.body.quantity ) : 
        // })
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.updateFranchiseProduct = updateFranchiseProduct;
