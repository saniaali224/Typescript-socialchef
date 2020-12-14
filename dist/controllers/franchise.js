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
exports.editFranchise = exports.findFranchise = exports.findFranchises = exports.deleteFranchise = exports.createFranchise = void 0;
const franchise_1 = __importDefault(require("../models/franchise"));
/*
*** Api for creating a franchise***
*/
const createFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const newFranchise = yield franchise_1.default.create({
            storeId: storeUser.storeId.id,
            name: req.body.franchiseName,
            phone: req.body.phone,
            address: req.body.address
        });
        if (!newFranchise) {
            return res.status(400).json({ msg: 'Franchise not created' });
        }
        res.status(200).json({ msg: 'franchise created', franchise: newFranchise });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.createFranchise = createFranchise;
/*
*** Api for deleting a franchise***
*/
const deleteFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const newFranchise = yield franchise_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body.id,
            isDeleted: false
        }, {
            isDeleted: true
        });
        if (newFranchise.nModified === 0) {
            return res.status(400).json({ msg: 'Franchise Not deleted' });
        }
        res.status(200).json({ msg: 'franchise soft Deleted' });
    }
    catch (error) {
        console.log('error::::::', error);
        res.status(500).json({ msg: error.message });
    }
});
exports.deleteFranchise = deleteFranchise;
/*
*** Api for finding all franchises of a store***
*/
const findFranchises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const franchises = yield franchise_1.default.find({
            storeId: storeUser.storeId.id,
            isDeleted: false
        }, '_id address name phone');
        if (!franchises[0]) {
            return res.status(404).json({ msg: 'No franchises found of your store' });
        }
        res.status(200).json({ msg: 'frachises found', franchises: franchises });
    }
    catch (error) {
        console.log('error::::::', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.findFranchises = findFranchises;
/*
*** Api for finding a franchise by id***
*/
const findFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const foundFranchise = yield franchise_1.default.findOne({
            storeId: storeUser.storeId.id,
            _id: req.body.id,
            isDeleted: false
        }, '_id isDeleted address name phone');
        if (!foundFranchise) {
            return res.status(404).json({ msg: 'No franchise found of this id' });
        }
        res.status(200).json({ msg: 'frachise found', franchise: foundFranchise });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.findFranchise = findFranchise;
/*
*** Api for editing a franchise by id***
*/
const editFranchise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const editedFranchise = yield franchise_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body.id,
            isDeleted: false
        }, {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address
        });
        if (editedFranchise.nModified == 0) {
            return res.status(404).json({ msg: 'No franchise edited of this id' });
        }
        res.status(200).json({ msg: 'frachise edited' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.editFranchise = editFranchise;
