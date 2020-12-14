"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    accessKeyId: `${process.env.ACCESS_KEY}`,
    secretAccessKey: `${process.env.SECRET_KEY}`,
    region: `${process.env.REGION}`
});
const s3 = new aws_sdk_1.default.S3({ params: { Bucket: 'reactive-pos' } });
const upload = (fileName, imageBuffer, fileType, req) => {
    return s3.upload({
        Key: Date.now() + fileName,
        Body: imageBuffer,
        ContentEncoding: 'base64',
        ContentType: fileType,
    }, req).promise();
};
exports.upload = upload;
