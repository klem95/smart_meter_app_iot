"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.ReturnSamples = express_validator_1.checkSchema({
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
//# sourceMappingURL=user.js.map