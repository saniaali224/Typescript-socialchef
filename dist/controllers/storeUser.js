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
exports.editStoreUser = exports.findRoleStoreUsers = exports.findFranchiseStoreUsers = exports.findStoreUsers = exports.deleteStoreUser = exports.addStoreUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const storeUser_1 = __importDefault(require("../models/storeUser"));
const roles_1 = __importDefault(require("../models/roles"));
const franchise_1 = __importDefault(require("../models/franchise"));
/*
*** Api for creating a store User***
*/
const addStoreUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (!req.body.role || !req.body.email || !req.body.password || !req.body.franchiseId) {
            return res.status(403).json({ msg: 'Fields Missing' });
        }
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const existingUser = yield storeUser_1.default.findOne({
            storeId: storeUser.storeId.id,
            email: req.body.email
        });
        if (existingUser) {
            return res.status(409).json({ msg: 'User already exist with this email' });
        }
        const role = yield roles_1.default.findOne({ roleName: req.body.role });
        if (!role) {
            return res.status(400).json({ msg: 'No role Found' });
        }
        const hashedPass = yield bcryptjs_1.default.hash(req.body.password, 12);
        const existingfranchise = yield franchise_1.default.findOne({
            storeId: storeUser.storeId.id,
            _id: req.body.franchiseId
        }, '_id isDeleted');
        if (!existingfranchise || existingfranchise.isDeleted) {
            return res.status(400).json({ msg: 'no franchise found' });
        }
        const newStoreUser = yield storeUser_1.default.create({
            storeId: storeUser.storeId.id,
            franchiseId: existingfranchise.id,
            role: role.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPass,
            address: req.body.address,
            phone: req.body.phone
        });
        if (!newStoreUser) {
            return res.status(404).json({ msg: 'store User not created' });
        }
        res.status(200).json({ msg: 'Store user created', storeUser: newStoreUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
});
exports.addStoreUser = addStoreUser;
/*
*** Api for deleting a store User***
*/
const deleteStoreUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (!req.body.storeUserId) {
            return res.status(403).json({ msg: 'Fields Missing' });
        }
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const newStoreUser = yield storeUser_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body.storeUserId,
            isDeleted: false
        }, {
            isDeleted: true
        });
        if (newStoreUser.nModified === 0) {
            return res.status(400).json({ msg: 'store user not deleted' });
        }
        res.status(200).json({ msg: 'Store user deleted' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.deleteStoreUser = deleteStoreUser;
/*
*** Api for finding all store Users***
*/
const findStoreUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const storeUsers = yield storeUser_1.default.find({
            storeId: storeUser.storeId.id,
            isDeleted: false
        }).populate('role', '_id roleName');
        if (!storeUsers[0]) {
            return res.status(404).json({ msg: 'No store Users found' });
        }
        res.status(200).json({ msg: 'Store users found', storeUsers: storeUsers });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.findStoreUsers = findStoreUsers;
/*
*** Api for finding store Users of a franchise***
*/
const findFranchiseStoreUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName === 'store admin' && !req.body.franchiseId) {
            return res.status(403).json({ msg: 'must provide franchiseId ' });
        }
        const storeUsers = yield storeUser_1.default.find({
            storeId: storeUser.storeId.id,
            franchiseId: storeUser.role.roleName === 'store admin' ? req.body.franchiseId : storeUser.franchiseId.id,
            isDeleted: false
        });
        if (!storeUsers[0]) {
            return res.status(404).json({ msg: 'No store Users found' });
        }
        res.status(200).json({ msg: 'franchise Store users found', storeUsers: storeUsers });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.findFranchiseStoreUsers = findFranchiseStoreUsers;
/*
*** Api for finding store Users by role***
*/
const findRoleStoreUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (!req.body.roleName) {
            return res.status(400).json({ msg: 'must provide roleName' });
        }
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const role = yield roles_1.default.findOne({ roleName: req.body.roleName });
        if (!role) {
            return res.status(404).json({ msg: 'No role found' });
        }
        const storeUsers = yield storeUser_1.default.find({
            storeId: storeUser.storeId.id,
            role: role.id,
            isDeleted: false
        });
        if (!storeUsers[0]) {
            return res.status(404).json({ msg: 'No store Users found of this role' });
        }
        res.status(200).json({ msg: 'users found', storeUsers: storeUsers });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.findRoleStoreUsers = findRoleStoreUsers;
/*
*** Api for editing a store User***
*/
const editStoreUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const editedUser = yield storeUser_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body.id,
            isDeleted: false
        }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            phone: req.body.phone
        });
        if (editedUser.nModified == 0) {
            return res.status(404).json({ msg: 'No store User edited of this id' });
        }
        res.status(200).json({ msg: 'Store user edited', storeUsers: editedUser });
    }
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});
exports.editStoreUser = editStoreUser;
