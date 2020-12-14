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
exports.editSupllier = exports.deleteSupplier = exports.addSupplier = exports.franchiseSuppliers = exports.storeSuppliers = void 0;
const supplier_1 = __importDefault(require("../models/supplier"));
/*
*** Api for viewing all suppliers of a store ***
*/
const storeSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        const suppliers = yield supplier_1.default.find({
            storeId: storeUser.storeId.id,
            isDeleted: false
        }).populate('franchiseId', 'name');
        if (!suppliers[0]) {
            return res.status(404).json({ msg: 'No suppliers Found' });
        }
        res.status(200).json({ msg: 'Suppliers found', suppliers: suppliers });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.storeSuppliers = storeSuppliers;
/*
*** Api for viewing all suppliers of a franchise ***
*/
const franchiseSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const suppliers = yield supplier_1.default.find({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            isDeleted: false
        }, '_id firstName companyName address contactNo franchiseId');
        if (!suppliers[0]) {
            return res.status(200).json({ msg: 'No franchise suppliers Found' });
        }
        res.status(200).json({ msg: 'franchise Suppliers found', suppliers: suppliers });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.franchiseSuppliers = franchiseSuppliers;
/*
*** Api for adding a supplier of a franchise ***
*/
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store amdin' && !req.body.franchiseId) {
            return res.status(400).json({ msg: 'Must provide Franchise Id' });
        }
        const newSupplier = yield supplier_1.default.updateOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            companyName: req.body.companyName,
            contactNo: req.body.phone,
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            accountNo: req.body.accountNo,
            address: req.body.address,
            email: req.body.email,
            isDeleted: false
        }, { upsert: true });
        if (newSupplier.upserted) {
            return res.status(200).json({ msg: 'Supplier created' });
        }
        res.status(201).json({ msg: 'supplier updated' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.addSupplier = addSupplier;
/*
*** Api for deleting a supplier of a franchise ***
*/
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store amdin' && !req.body.franchiseId) {
            return res.status(400).json({ msg: 'Must provide Franchise Id' });
        }
        const newSupplier = yield supplier_1.default.updateOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            _id: req.body.supplierId,
            isDeleted: false
        }, {
            isDeleted: true
        });
        if (newSupplier.nModified === 0) {
            return res.status(400).json({ msg: 'Supplier not deleted' });
        }
        res.status(201).json({ msg: 'supplier soft deleted' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.deleteSupplier = deleteSupplier;
/*
*** Api for editing a supplier ***
*/
const editSupllier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        console.log('body:::', req.body);
        if (storeUser.role.roleName === 'store amdin' && !req.body.franchiseId) {
            return res.status(400).json({ msg: 'Must provide Franchise Id' });
        }
        const newSupplier = yield supplier_1.default.updateOne({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName == 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            _id: req.body._id
        }, {
            companyName: req.body.companyName,
            contactNo: req.body.contactNo,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            accountNo: req.body.accountNo,
            address: req.body.address,
            email: req.body.email,
        });
        if (newSupplier.nModified == 0) {
            return res.status(400).json({ msg: 'Supplier Not Edited' });
        }
        res.status(201).json({ msg: 'supplier edited' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.editSupllier = editSupllier;
