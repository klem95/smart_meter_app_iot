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
const userRouter = express_1.Router();
userRouter.get('/', user.getDate);
exports.default = userRouter;
//# sourceMappingURL=user.js.map