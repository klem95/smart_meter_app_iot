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
const express_validator_1 = require("express-validator");
const Smart_meter_sample_1 = __importDefault(require("../model/Smart-meter-sample"));
const { Op } = require('sequelize');
exports.returnSmData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            const smartMeterSamples = yield Smart_meter_sample_1.default.findAll({ where: { date: { [Op.between]: [req.body.startDate, req.body.startEnd] } } });
            console.log(smartMeterSamples);
            res.status(200).json({ success: true, message: 'gj m8' });
        }
        else {
            res.status(400).json({ err: valError });
        }
    }
    catch (e) {
        next(new Error('Error! Could not return sample data'));
    }
});
//# sourceMappingURL=admin.js.map