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
const Smart_meter_sample_1 = __importDefault(require("../models/Smart-meter-sample"));
const LSTM_model_1 = require("../utils/LSTM-model");
const express_validator_1 = require("express-validator");
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
        if (LSTM_model_1.LSTMmodel != undefined) {
            const predictions = yield LSTM_model_1.predictFuture();
            res.status(200).json({ predictions });
        }
        else {
            res.status(400).json({ error: "Please train model" });
        }
    }
    catch (e) {
        console.log(e);
        next(new Error('Error! Could not generate predictions'));
    }
});
//# sourceMappingURL=electricity-supplier.js.map