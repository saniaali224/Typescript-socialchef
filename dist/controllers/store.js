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
exports.getSetting = exports.settings = exports.allStoresAndFranchises = exports.deleteStore = exports.allStores = exports.findStore = exports.createStore = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const storeUser_1 = __importDefault(require("../models/storeUser"));
const store_1 = __importDefault(require("../models/store"));
const franchise_1 = __importDefault(require("../models/franchise"));
const roles_1 = __importDefault(require("../models/roles"));
/*
*** Super Admin Api for Store Creation ***
*/
const createStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.storeName || !req.body.address || !req.body.email || !req.body.password) {
            return res.status(403).json({ msg: 'Fields Missing' });
        }
        const storeExists = yield store_1.default.findOne({ storeName: req.body.storeName });
        if (storeExists) {
            return res.status(409).json({ msg: 'store Already Exist with this name' });
        }
        const storeName = req.body.storeName.split(' ').join('');
        const newStore = yield store_1.default.create({
            storeName: req.body.storeName,
            domain: storeName + '.rs.com'
        });
        const newFranchise = yield franchise_1.default.create({
            storeId: newStore.id,
            address: req.body.address
        });
        const hashedPass = yield bcryptjs_1.default.hash(req.body.password, 12);
        const role = yield roles_1.default.findOne({ roleName: 'store admin' });
        if (!role) {
            return res.status(404).json({ msg: 'No role Found ' });
        }
        const newStoreUser = yield storeUser_1.default.create({
            storeId: newStore.id,
            role: role.id,
            email: req.body.email,
            password: hashedPass
        });
        res.status(200).json({ msg: 'Store Created', store: newStore, franchise: newFranchise, storeUser: newStoreUser });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.createStore = createStore;
/*
*** Api for finding a Store***
*/
const findStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentStore = yield store_1.default.findOne({ storeName: req.body.storeName });
        if (!currentStore) {
            return res.status(404).json({ msg: 'No store found of this name' });
        }
        res.status(200).json({ msg: 'store found', store: currentStore });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.findStore = findStore;
/*
*** Api for soft deleting a Store***
*/
const deleteStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedStore = yield store_1.default.updateOne({
            _id: req.body.id,
            isDeleted: false
        }, { isDeleted: true });
        if (deletedStore.nModified === 0) {
            return res.status(400).json({ msg: 'No store Deleted' });
        }
        res.status(200).json({ msg: 'Store soft Deleted' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal sever error' });
    }
});
exports.deleteStore = deleteStore;
/*
*** Api for finding all Stores***
*/
const allStores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allStores = yield store_1.default.find();
        if (!allStores[0]) {
            return res.status(404).json({ msg: 'No stores' });
        }
        res.status(200).json({ msg: 'Stores found', store: allStores });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.allStores = allStores;
/*
*** Api for finding all Stores and thier franchises***
*/
const allStoresAndFranchises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allStores = yield franchise_1.default.find().populate('storeId');
        if (!allStores[0]) {
            return res.status(404).json({ msg: 'No stores and franchises' });
        }
        res.status(200).json({ msg: 'Stores and franchises found', store: allStores });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.allStoresAndFranchises = allStoresAndFranchises;
/*
*** Api for posting settings of a Store***
*/
const settings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not Authorized' });
        }
        const currentStore = yield store_1.default.updateOne({
            _id: storeUser.storeId.id
        }, {
            storeName: req.body.storeName,
            storeAddress: req.body.storeAddress,
            ownerName: req.body.ownerName,
            phone: req.body.phone,
            slogan: req.body.slogan,
            email: req.body.email
        });
        if (currentStore.nModified == 0) {
            return res.status(404).json({ msg: 'No store edited of this name' });
        }
        res.status(200).json({ msg: 'store edited' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.settings = settings;
/*
*** Api for getting settings of a Store***
*/
const getSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not Authorized' });
        }
        const currentStore = yield store_1.default.findOne({
            _id: storeUser.storeId.id
        });
        if (!currentStore) {
            return res.status(404).json({ msg: 'No store found' });
        }
        res.status(200).json({ msg: 'store found', store: currentStore });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.getSetting = getSetting;
