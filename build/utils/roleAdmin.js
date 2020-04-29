"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Admin_1 = __importDefault(require("../models/Admin"));
const ElectricitySupplier_1 = __importDefault(require("../models/ElectricitySupplier"));
const User_1 = __importDefault(require("../models/User"));
exports.adminCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user != null) {
        const userObj = Object.values(req.user);
        const adminId = userObj[0];
        const adminEmail = userObj[1];
        const adminUser = yield Admin_1.default.count({ where: { id: adminId, email: adminEmail } });
        if (adminUser === 0) {
            res.status(400).json({ success: false, message: "Only admins have access to this endpoint " });
        }
        else {
            req.body.id = adminId;
            req.body.email = adminEmail;
            next();
        }
    }
});
exports.electricitySupplierCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user != null) {
        const userObj = Object.values(req.user);
        const esId = userObj[0];
        const esMail = userObj[1];
        const esUser = yield ElectricitySupplier_1.default.count({ where: { id: esId, email: esMail } });
        if (esUser === 0) {
            res.status(400).json({ success: false, message: "Only the electricity supplier has access to this endpoint " });
        }
        else {
            req.body.id = esId;
            req.body.email = esMail;
            next();
        }
    }
});
exports.customerCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user != null) {
        const userObj = Object.values(req.user);
        const customerId = userObj[0];
        const customerMail = userObj[1];
        const customerUser = yield User_1.default.count({ where: { id: customerId, email: customerMail } });
        if (customerUser === 0) {
            res.status(400).json({ success: false, message: "Only the customers supplier has access to this endpoint " });
        }
        else {
            req.body.id = customerId;
            req.body.email = customerMail;
            next();
        }
    }
});
//# sourceMappingURL=roleAdmin.js.map