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
const electricitySupplier = __importStar(require("../controller/electricity-supplier"));
const electricitySupplierRouter = express_1.Router();
electricitySupplierRouter.get('/generateModel', electricitySupplier.generateModel);
exports.default = electricitySupplierRouter;
//# sourceMappingURL=electricity-supplier.js.map