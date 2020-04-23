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
const admin = __importStar(require("../controller/admin"));
const adminValidators = __importStar(require("../validators/admin"));
const adminRouter = express_1.Router();
adminRouter.post('/get-sm-data', adminValidators.returnSmData, admin.returnSmData);
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map