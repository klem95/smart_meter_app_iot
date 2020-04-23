"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.returnSmData = express_validator_1.checkSchema({
    meterId: {
        in: ['body'],
        isInt: true,
        errorMessage: "meterId needs to be of type int"
    },
    startDate: {
        in: ['body'],
        isISO8601: true,
        errorMessage: "startDate needs to be of type date: yyyy-mm-dd"
    },
    endDate: {
        in: ['body'],
        isISO8601: true,
        errorMessage: "endDate needs to be of type date: yyyy-mm-dd"
    }
});
//# sourceMappingURL=admin.js.map