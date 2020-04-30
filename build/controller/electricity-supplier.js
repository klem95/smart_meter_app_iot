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
const Smart_meter_sample_1 = __importDefault(require("../models/Smart-meter-sample"));
const LSTM_model_1 = require("../utils/LSTM-model");
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
const sequelize_1 = __importStar(require("sequelize"));
exports.getAdminsAndUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield Admin_1.default.findAll();
        let users = [];
        if (admins.length > 0) {
            console.log(admins.length);
            for (let i = 0; i < admins.length; i++) {
                const adminId = admins[i].id;
                let _users = yield User_1.default.findAll({ where: { adminId: adminId } });
                console.log(_users);
                _users.forEach(value => {
                    users.push(value);
                });
            }
            res.status(200).json({ success: true, result: { admins: admins, customers: users } });
        }
        else {
            res.status(400).json({ message: 'no admins were found' });
        }
    }
    catch (e) {
        next(new Error('Error! Could not retrive admins and users'));
    }
});
exports.generateModel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            const epochsNo = parseInt(req.query.epochsNo.toString());
            const learningRate = parseFloat(req.query.learningRate.toString());
            const hiddenLayers = parseInt(req.query.hiddenLayers.toString());
            const windowSize = parseInt(req.query.windowSize.toString());
            const meterId = parseInt(req.query.meterId.toString());
            const waterSamples = yield Smart_meter_sample_1.default.findAll({ where: { meterId: meterId } });
            const result = yield LSTM_model_1.train(waterSamples, epochsNo, learningRate, hiddenLayers, windowSize);
            res.status(200).json({ success: true, result: "Model is trained" });
        }
        else {
            res.status(400).json({ error: valError });
        }
    }
    catch (e) {
        next(new Error('Error! Could not build model'));
    }
});
exports.getPredictions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError) {
            if (LSTM_model_1.LSTMmodel != undefined) {
                const user = yield User_1.default.findOne({ where: { id: req.params.id } });
                const meterId = user === null || user === void 0 ? void 0 : user.meterId;
                console.log(user);
                if (meterId != undefined) {
                    const meterData = yield Smart_meter_sample_1.default.findAll({ where: { meterId: meterId } });
                    const predictions = yield LSTM_model_1.predictFuture(meterData);
                    res.status(200).json({ predictions });
                }
            }
            else {
                res.status(400).json({ error: "Please train model" });
            }
        }
        else {
            res.status(400).json({ error: valError });
        }
    }
    catch (e) {
        console.log(e);
        next(new Error('Error! Could not generate predictions'));
    }
});
exports.ReturnSamples = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty()) {
            console.log(req.body);
            const user = yield User_1.default.findOne({ where: { id: req.params.id } });
            if (user) {
                const startDate = new Date(req.query.startDate.toString());
                const endDate = new Date(req.query.endDate.toString());
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
                res.status(400).json({ err: 'no user was found' });
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
            const user = yield User_1.default.findOne({ where: { id: req.params.id } });
            if (user) {
                const startDate = new Date(req.query.startDate.toString());
                const endDate = new Date(req.query.endDate.toString());
                const smartMeterSamples = yield Smart_meter_sample_1.default.findAll({ where: { meterId: user.meterId, date: { [sequelize_1.Op.between]: [startDate, endDate] } } });
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
        next(new Error('Error! Could not return ranking'));
    }
});
//# sourceMappingURL=electricity-supplier.js.map