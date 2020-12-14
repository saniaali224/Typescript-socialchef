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
const storeUser_1 = __importDefault(require("../../models/storeUser"));
const softDelete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storeUser = yield storeUser_1.default.findById(req.body.user.userId)
        .populate('storeId')
        .populate('franchiseId')
        .populate('role');
    if (storeUser.role.roleName === 'store admin') {
        if (storeUser.isDeleted || storeUser.storeId.isDeleted) {
            return res.status(401).json({ msg: 'User or Store is soft deleted' });
        }
        req.body.user = storeUser;
        return next();
    }
    if (storeUser.isDeleted || storeUser.storeId.isDeleted || storeUser.franchiseId.isDeleted) {
        return res.status(401).json({ msg: 'User , Store or Franchise is soft deleted' });
    }
    else {
        req.body.user = storeUser;
        next();
    }
});
exports.default = softDelete;
