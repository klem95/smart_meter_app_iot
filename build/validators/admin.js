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
const User_1 = __importDefault(require("../model/User"));
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
        errorMessage: "meterId needs to be of type int",
        custom: {
            options: (val) => __awaiter(void 0, void 0, void 0, function* () {
                if ((yield User_1.default.count({ where: { id: val } })) === 0)
                    return Promise.reject();
            }),
            errorMessage: 'The provided id does not match any meter'
        }
    },
});
//# sourceMappingURL=admin.js.map