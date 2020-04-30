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
const User_1 = __importDefault(require("../models/User"));
exports.generateModel = express_validator_1.checkSchema({
    epochsNo: {
        in: ["query"],
        isInt: {
            options: [{ min: 1, max: 5000 }],
        },
        errorMessage: 'epochsNo has to be of type int (min: 1, max: 5000)',
    },
    learningRate: {
        in: ["query"],
        isFloat: {
            options: [{ min: 0.0005, max: 1000 }],
        },
        errorMessage: 'learningRate has to be of type float (min: 0.0005, max: 1000)'
    },
    hiddenLayers: {
        in: ["query"],
        isFloat: {
            options: [{ min: 1, max: 100 }],
        },
        errorMessage: 'hiddenLayers has to be of type int  (min: 1, max: 100)'
    },
    windowSize: {
        in: ["query"],
        isFloat: {
            options: [{ min: 1, max: 2000 }],
        },
        errorMessage: 'windowSize has to be of type int  (min: 1, max: 2000)'
    }
});
exports.getPredictions = express_validator_1.checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: "id needs to be of type int.",
        custom: {
            options: (val) => __awaiter(void 0, void 0, void 0, function* () {
                if ((yield User_1.default.count({ where: { id: val } })) === 0)
                    return Promise.reject();
            }),
            errorMessage: 'The provided id does not match any user'
        }
    }
});
exports.ReturnSamples = express_validator_1.checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: "meterId needs to be of type int.",
        custom: {
            options: (val) => __awaiter(void 0, void 0, void 0, function* () {
                if ((yield User_1.default.count({ where: { id: val } })) === 0)
                    return Promise.reject();
            }),
            errorMessage: 'The provided id does not match any user'
        }
    },
    startDate: {
        in: ['query'],
        isISO8601: true,
        errorMessage: "startDate needs to be of type date: yyyy-mm-dd",
    },
    endDate: {
        in: ['query'],
        isISO8601: true,
        errorMessage: "endDate needs to be of type date: yyyy-mm-dd"
    }
});
exports.avgSpending = express_validator_1.checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: "meterId needs to be of type int.",
        custom: {
            options: (val) => __awaiter(void 0, void 0, void 0, function* () {
                if ((yield User_1.default.count({ where: { id: val } })) === 0)
                    return Promise.reject();
            }),
            errorMessage: 'The provided id does not match any user'
        }
    },
    startDate: {
        in: ['query'],
        isISO8601: true,
        errorMessage: "startDate needs to be of type date: yyyy-mm-dd",
    },
    endDate: {
        in: ['query'],
        isISO8601: true,
        errorMessage: "endDate needs to be of type date: yyyy-mm-dd"
    }
});
//# sourceMappingURL=es.js.map