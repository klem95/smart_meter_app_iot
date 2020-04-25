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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Smart_meter_sample_1 = __importDefault(require("../model/Smart-meter-sample"));
const sequelize_1 = __importStar(require("sequelize"));
exports.cronePing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ success: true });
});
exports.ReturnSamples = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            const startDate = new Date(req.query.startDate.toString());
            const endDate = new Date(req.query.endDate.toString());
            console.log(req.query);
            console.log(startDate);
            console.log(endDate);
            const smartMeterSamples = yield Smart_meter_sample_1.default.findAll({ where: { meterId: req.params.id, date: { [sequelize_1.Op.between]: [startDate, endDate] } } });
            if (smartMeterSamples.length != 0) {
                res.status(200).json({ success: true, result: { smartMeterSamples } });
            }
            else {
                const smsStart = yield Smart_meter_sample_1.default.findOne({ attributes: [[sequelize_1.default.fn('min', sequelize_1.default.col('date')), 'min']] });
                const smsEnd = yield Smart_meter_sample_1.default.findOne({ attributes: [[sequelize_1.default.fn('max', sequelize_1.default.col('date')), 'max']] });
                res.status(400).json({ err: 'no samples found within the provided date range', samplePeriod: { first: smsStart, last: smsEnd } });
            }
        }
        else {
            res.status(400).json({ err: valError });
        }
    }
    catch (e) {
        next(new Error('Error! Could not return sample data'));
    }
});
exports.avgSpending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            const smartMeterSamples = yield Smart_meter_sample_1.default.findAll({ where: { meterId: req.params.id } });
            let totalWh = 0;
            let avgKWhPrice = 2.25;
            smartMeterSamples.forEach(val => {
                totalWh += val.wattsPerHour;
            });
            avgKWhPrice = (totalWh / 1000) * avgKWhPrice;
            const avgWh = totalWh / smartMeterSamples.length;
            res.status(200).json({ success: true, result: { avgWh: avgWh, avgSpending: avgKWhPrice } });
        }
        else {
            res.status(400).json({ err: valError });
        }
    }
    catch (e) {
        next(new Error('Error! Could not return ranking'));
    }
});
//# sourceMappingURL=admin.js.map