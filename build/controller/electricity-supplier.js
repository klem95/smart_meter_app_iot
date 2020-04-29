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
let meterId = 1;
exports.generateModel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const waterSamples = yield Smart_meter_sample_1.default.findAll({ where: { meterId: meterId } });
    LSTM_model_1.train(waterSamples);
    res.send("electricity supplier");
});
//# sourceMappingURL=electricity-supplier.js.map