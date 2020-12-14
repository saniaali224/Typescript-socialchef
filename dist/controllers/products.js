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
exports.editGenericProduct = exports.viewProductsByCategory = exports.addGenericProduct = exports.viewProducts = void 0;
const products_1 = __importDefault(require("../models/products"));
const category_1 = __importDefault(require("../models/category"));
const aws_1 = require("../utitly/aws");
/*
*** Api for viewing generic products***
*/
const viewProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin' && storeUser.role.roleName !== 'franchise admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const products = yield products_1.default.find({ storeId: storeUser.storeId.id }).populate('category', 'name -_id');
        if (!products[0]) {
            return res.status(404).json({ msg: 'No products' });
        }
        res.status(200).json({ msg: 'products found', products: products });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
exports.viewProducts = viewProducts;
/*
*** Api for adding generic products***
*/
const addGenericProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (!req.body.productName || !req.body.categoryId || !req.body.productCode) {
            return res.status(400).json({ msg: 'Fields missing' });
        }
        // decode base64 and upload to directory
        if (req.body.imageField && req.body.imageField.filename) {
            var imageBuffer = new Buffer(req.body.imageField.base64.split(',')[1], 'base64');
            var fileName = Date.now() + req.body.imageField.filename;
            var image = yield aws_1.upload(fileName, imageBuffer, req.body.imageField.filetype, req);
            if (image.hasOwnProperty('Location')) {
                req.body.imageField = image.Location;
            }
            else {
                return res.status(400).json({ status: false, msg: 'Error uploading image' });
            }
        }
        const newProduct = yield products_1.default.updateOne({
            storeId: storeUser.storeId.id,
            name: req.body.productName,
            productCode: req.body.productCode,
            category: req.body.categoryId
        }, {
            costPrice: req.body.costPrice,
            openingStock: req.body.openingStock || 1,
            minimumQuantity: req.body.minimumQuantity,
            maximumQuantity: req.body.maximumQuantity,
            minimumRetailPrice: req.body.minimumRetailPrice,
            productTax: req.body.productTax,
            unit: req.body.unit,
            status: req.body.status,
            description: req.body.description,
            imageField: req.body.imageField || ''
        }, { upsert: true });
        if (newProduct.upserted) {
            return res.status(200).json({ msg: 'Product added' });
        }
        res.status(201).json({ msg: 'prodcut updated' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.addGenericProduct = addGenericProduct;
/*
*** Api for viewing generic products by category***
*/
const viewProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield products_1.default.find({
            category: req.body.id
        });
        if (!products[0]) {
            return res.status(404).json({ msg: 'no products found of this category' });
        }
        res.status(200).json({ msg: 'prodcuts found ', products: products });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.viewProductsByCategory = viewProductsByCategory;
/*
*** Api for viewing generic products by category***
*/
const editGenericProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (req.body.imageField && req.body.imageField.filename) {
            var imageBuffer = new Buffer(req.body.imageField.base64.split(',')[1], 'base64');
            var fileName = Date.now() + req.body.imageField.filename;
            var image = yield aws_1.upload(fileName, imageBuffer, req.body.imageField.filetype, req);
            if (image.hasOwnProperty('Location')) {
                req.body.imageField = image.Location;
            }
            else {
                return res.status(400).json({ status: false, msg: 'Error uploading image' });
            }
        }
        const category = yield category_1.default.findOne({ name: req.body.category });
        if (!category) {
            return res.status(404).json({ status: false, msg: 'No category Found' });
        }
        const newProduct = yield products_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body._id
        }, {
            name: req.body.name,
            category: category.id,
            productCode: req.body.productCode,
            costPrice: req.body.costPrice,
            openingStock: req.body.openingStock || 1,
            minimumQuantity: req.body.minimumQuantity,
            maximumQuantity: req.body.maximumQuantity,
            minimumRetailPrice: req.body.minimumRetailPrice,
            productTax: req.body.productTax,
            unit: req.body.unit,
            status: req.body.status,
            description: req.body.description,
            imageField: req.body.imageField || ''
        });
        if (newProduct.nModified == 0) {
            return res.status(200).json({ msg: 'Product not edited' });
        }
        res.status(201).json({ msg: 'prodcut edited' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.editGenericProduct = editGenericProduct;
