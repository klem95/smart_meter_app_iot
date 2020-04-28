"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const enums_1 = require("../utils/enums");
exports.signUp = express_validator_1.checkSchema({
    email: {
        in: ["body"],
        isEmail: true,
        errorMessage: "email needs to of appropriate format"
    },
    password: {
        in: ["body"],
        isString: true,
        isLength: {
            options: [{ min: 5, max: 25 }],
        },
        errorMessage: "password needs to be of type string, and be between 5-25 char"
    },
    role: {
        in: ["body"],
        isIn: {
            options: [enums_1.roleArr],
        },
        errorMessage: "role needs to be one of the following: " + enums_1.roleArr
    }
});
//# sourceMappingURL=user-interface.js.map