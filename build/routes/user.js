"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user = __importStar(require("../controller/user"));
const userVal = __importStar(require("../validators/user"));
const userRouter = express_1.Router();
userRouter.get('/return-samples', userVal.ReturnSamples, user.ReturnSamples);
userRouter.get('/avg-spending', userVal.avgSpending, user.avgSpending);
exports.default = userRouter;
//# sourceMappingURL=user.js.map