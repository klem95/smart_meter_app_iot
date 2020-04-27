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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user != null) {
        const userObj = Object.values(req.user);
        const role = userObj[userObj.length - 1];
        if (role != "admin") {
            res.status(400).json({ success: false, message: "Only admins have access to this endpoint " });
        }
        else {
            next();
        }
    }
});
exports.electricitySupplierCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user != null) {
        const userObj = Object.values(req.user);
        const role = userObj[userObj.length - 1];
        if (role != "electricity supplier") {
            res.status(400).json({ success: false, message: "Only the electricity supplier has access to this endpoint " });
        }
        else {
            next();
        }
    }
});
//# sourceMappingURL=roleAdmin.js.map