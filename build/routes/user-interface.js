"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const userInterface = __importStar(require("../controller/user-interface"));
const userInterfaceVal = __importStar(require("../validators/user-interface"));
const admin = __importStar(require("../controller/admin"));
require('../auth/auth');
const userInterfaceRouter = express_1.Router();
const jwt = require('jsonwebtoken');
userInterfaceRouter.get('/crone-ping', admin.cronePing);
userInterfaceRouter.post('/sign-up', userInterfaceVal.signUp, passport_1.default.authenticate('signup', { session: false }), userInterface.signUp);
userInterfaceRouter.post('/login', userInterface.login);
exports.default = userInterfaceRouter;
//# sourceMappingURL=user-interface.js.map