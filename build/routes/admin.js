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
adminRouter.get('/avg-spending/:id', adminValidators.avgSpending, admin.avgSpending);
adminRouter.post('/return-samples', adminValidators.ReturnSamples, admin.ReturnSamples);
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map