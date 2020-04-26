"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("./admin"));
const user_1 = __importDefault(require("./user"));
const electricity_supplier_1 = __importDefault(require("./electricity-supplier"));
const user_interface_1 = __importDefault(require("./user-interface"));
const passport_1 = __importDefault(require("passport"));
const roleAdmin_1 = require("../utils/roleAdmin");
const mainRouter = express_1.Router();
mainRouter.use('/admin', passport_1.default.authenticate('jwt', { session: false }), roleAdmin_1.adminCheck, admin_1.default); // Mounts the route as middleware
mainRouter.use('/user', user_1.default);
mainRouter.use('/electricitySupplier', passport_1.default.authenticate('jwt', { session: false }), roleAdmin_1.electricitySupplierCheck, electricity_supplier_1.default);
mainRouter.use('/user-interface', user_interface_1.default);
mainRouter.get('/*', (req, res) => {
    res.status(404).send('404. This endpoint does not exist');
});
exports.default = mainRouter;
//# sourceMappingURL=index.js.map