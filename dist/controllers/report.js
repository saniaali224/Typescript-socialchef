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
exports.saleReport = exports.stockReport = void 0;
const franchise_product_1 = __importDefault(require("../models/franchise-product"));
/*
*** Api for stock report***
*/
const stockReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeUser = req.body.user;
        if (storeUser.role.roleName !== 'store admin') {
            return res.status(400).json({ msg: ' Not Authorized or Missing franchise Id' });
        }
        const report = yield franchise_product_1.default.aggregate([
            {
                $lookup: {
                    "from": "invoice-details",
                    "let": {
                        productId: "$_id"
                    },
                    "pipeline": [
                        {
                            $match: {
                                $expr: {
                                    $and: [{
                                            $eq: [
                                                "$$productId",
                                                "$franchiseProductId"
                                            ]
                                        },
                                        {
                                            $eq: ["$type", "sale"]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "invoice"
                }
            },
            {
                $unwind: {
                    path: "$invoice"
                }
            },
        ]);
        if (!report[0]) {
            return res.status(404).json({ msg: ' No stock in this franchise' });
        }
        yield franchise_product_1.default.populate(report, { path: 'productId', select: '-_id name productCode costPrice' });
        return res.status(200).json({ report });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
    ;
});
exports.stockReport = stockReport;
const saleReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield franchise_product_1.default.aggregate([
            {
                $lookup: {
                    "from": "invoices",
                    "let": {
                        inv_id: "$invoiceId"
                    },
                    "pipeline": [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$$inv_id",
                                        "$_id"
                                    ]
                                }
                            }
                        }
                    ],
                    as: "invoice"
                }
            },
            {
                $unwind: {
                    path: "$invoice"
                }
            },
            {
                $match: {
                    "invoice.type": "purchase"
                }
            },
        ]);
        console.log('res::::', response);
        res.status(200).json({ res: response });
    }
    catch (error) {
    }
});
exports.saleReport = saleReport;
