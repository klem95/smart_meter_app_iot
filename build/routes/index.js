"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("./admin"));
const user_1 = __importDefault(require("./user"));
const electricity_supplier_1 = __importDefault(require("./electricity-supplier"));
const mainRouter = express_1.Router();
mainRouter.use('/admin', admin_1.default); // Mounts the route as middleware
mainRouter.use('/user', user_1.default);
mainRouter.use('/electricitySupplier', electricity_supplier_1.default);
mainRouter.get('/*', (req, res) => {
    res.status(404).send('404. This endpoint does not exist');
});
exports.default = mainRouter;
//# sourceMappingURL=index.js.map