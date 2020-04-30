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
const User_1 = __importDefault(require("../models/User"));
const Smart_meter_sample_1 = __importDefault(require("../models/Smart-meter-sample"));
const sequelize_1 = __importStar(require("sequelize"));
const timeConverter_1 = require("../utils/timeConverter");
exports.ReturnSamples = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            console.log(req.body);
            const user = yield User_1.default.findOne({ where: { id: req.body.id } });
            if (user) {
                let startDate = new Date(req.query.startDate.toString());
                let endDate = new Date(req.query.endDate.toString());
                startDate = yield timeConverter_1.convertTime(startDate, false);
                endDate = yield timeConverter_1.convertTime(endDate, true);
                const smartMeterSamples = yield Smart_meter_sample_1.default.findAll({ where: { meterId: user.meterId, date: { [sequelize_1.Op.between]: [startDate, endDate] } } });
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
                res.status(400).json({ err: 'no user with the given id belongs to this admin profile' });
            }
        }
        else {
            res.status(400).json({ err: valError });
        }
    }
    catch (e) {
        console.log(e);
        next(new Error('Error! Could not return sample data'));
    }
});
exports.avgSpending = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            const user = yield User_1.default.findOne({ where: { id: req.body.id } });
            if (user) {
                let startDate = new Date(req.query.startDate.toString());
                let endDate = new Date(req.query.endDate.toString());
                startDate = yield timeConverter_1.convertTime(startDate, false);
                endDate = yield timeConverter_1.convertTime(endDate, true);
                const smartMeterSamples = yield Smart_meter_sample_1.default.findAll({
                    where: {
                        meterId: user.meterId,
                        date: { [sequelize_1.Op.between]: [startDate, endDate] }
                    }
                });
                if (smartMeterSamples.length != 0) {
                    let totalWh = 0;
                    let KWhPrice = 2.25;
                    let noOfSamples = 0;
                    smartMeterSamples.forEach(val => {
                        totalWh += val.wattsPerHour;
                        noOfSamples++;
                    });
                    const avgKWh = (totalWh / noOfSamples) / 1000;
                    const totalSpending = (totalWh / 1000) * KWhPrice;
                    res.status(200).json({ success: true, result: { avgKWh: avgKWh, totalSpending: totalSpending } });
                }
                else {
                    const smsStart = yield Smart_meter_sample_1.default.findOne({ attributes: [[sequelize_1.default.fn('min', sequelize_1.default.col('date')), 'min']] });
                    const smsEnd = yield Smart_meter_sample_1.default.findOne({ attributes: [[sequelize_1.default.fn('max', sequelize_1.default.col('date')), 'max']] });
                    res.status(400).json({
                        err: 'no samples found within the provided date range',
                        samplePeriod: { first: smsStart, last: smsEnd }
                    });
                }
            }
            else {
                res.status(400).json({ err: 'no user with the given id belongs to this admin profile' });
            }
        }
        else {
            res.status(400).json({ err: valError });
        }
    }
    catch (e) {
        next(new Error('Error! Could not return ranking'));
    }
});
//# sourceMappingURL=user.js.map