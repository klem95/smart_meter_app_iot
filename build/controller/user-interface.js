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
const User_1 = __importDefault(require("../model/User"));
const express_validator_1 = require("express-validator");
const jwt = require('jsonwebtoken');
exports.signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty() && req.user != null) {
            const userObj = Object.values(req.user);
            const email = userObj[0];
            const dbObj = yield User_1.default.findOne({ where: { email: email, role: req.body.role } });
            console.log(dbObj);
            if (dbObj == null) {
                const newUser = new User_1.default({ email: email, password: userObj[1], role: req.body.role });
                newUser.save();
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
                });
                console.log("Create new users");
            }
            else {
                console.log("User already exist");
                res.status(200).json({
                    message: 'User already exist'
                });
            }
        }
        else {
            res.status(400).json({ err: valError });
        }
    }
    catch (e) {
        console.log(e);
        next(Error('Could not sign up new user...'));
    }
});
//# sourceMappingURL=user-interface.js.map