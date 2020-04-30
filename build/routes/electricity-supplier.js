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
const esValidators = __importStar(require("../validators/es"));
const electricitySupplierRouter = express_1.Router();
electricitySupplierRouter.get('/', electricitySupplier.getAdminsAndUsers);
electricitySupplierRouter.get('/generate-model', esValidators.generateModel, electricitySupplier.generateModel);
electricitySupplierRouter.get('/predict/:id', esValidators.getPredictions, electricitySupplier.getPredictions);
electricitySupplierRouter.get('/return-samples/:id', esValidators.ReturnSamples, electricitySupplier.ReturnSamples);
electricitySupplierRouter.get('/avg-spending/:id', esValidators.avgSpending, electricitySupplier.avgSpending);
exports.default = electricitySupplierRouter;
//# sourceMappingURL=electricity-supplier.js.map