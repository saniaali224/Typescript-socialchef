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
exports.editCategory = exports.addSubCategory = exports.allCategories = exports.createCategory = void 0;
const category_1 = __importDefault(require("../models/category"));
/*
*** Api for viewing all categories***
*/
const allCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        const category = yield category_1.default.find({ storeId: storeUser.storeId.id }, 'name subCategories');
        if (!category[0]) {
            return res.status(404).json({ msg: 'No categories found' });
        }
        res.status(200).json({ msg: 'categories found ', categories: category });
    }
    catch (error) {
    }
});
exports.allCategories = allCategories;
/*
*** Api for creating a category for products of a store***
*/
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const category = yield category_1.default.updateOne({
            storeId: storeUser.storeId.id,
            name: req.body.categoryName
        }, {}, { upsert: true });
        if (category.upserted) {
            return res.status(200).json({ msg: 'category created' });
        }
        res.status(200).json({ msg: 'category updated' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.createCategory = createCategory;
/*
*** Api for adding  subcategory to a category***
*/
const addSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const existingCategory = yield category_1.default.findOne({
            storeId: storeUser.storeId.id,
            _id: req.body.categoryId,
            subCategories: { $in: [req.body.subCategory] }
        }, '_id');
        if (existingCategory) {
            return res.status(400).json({ msg: "sub category already exist" });
        }
        const subcategory = yield category_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body.categoryId
        }, {
            $push: { subCategories: req.body.subCategory }
        });
        if (subcategory.nModified === 0) {
            return res.status(400).json({ msg: 'sub category not added' });
        }
        res.status(200).json({ msg: 'sub category added' });
    }
    catch (error) {
        console.log('error:::::', error);
        res.status(500).json({ msg: error.message });
    }
});
exports.addSubCategory = addSubCategory;
/*
*** Api for editing  a category***
*/
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }
        const category = yield category_1.default.updateOne({
            storeId: storeUser.storeId.id,
            _id: req.body._id
        }, {
            name: req.body.name
        });
        if (category.nModified == 0) {
            return res.status(400).json({ msg: 'category not edited' });
        }
        res.status(201).json({ msg: 'category updated' });
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.editCategory = editCategory;
