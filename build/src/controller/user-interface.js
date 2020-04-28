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
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../model/User"));
const express_validator_1 = require("express-validator");
const jwtConfig_1 = require("../jwtConfig");
const Admin_1 = __importDefault(require("../model/Admin"));
const ElectricitySupplier_1 = __importDefault(require("../model/ElectricitySupplier"));
const jwt = require('jsonwebtoken');
require('../auth/auth');
// TEMP SOLUTION... BAD.....
exports.signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const valError = express_validator_1.validationResult(req);
        if (valError.isEmpty() && req.user != null) {
            const userObj = Object.values(req.user);
            const email = userObj[0];
            if (req.body.role == 'user') {
                const newUser = new User_1.default({ firstName: req.body.firstName, lastName: req.body.lastName, email: email, password: userObj[1], adminId: req.body.adminId, meterId: req.body.meterId, address: req.body.address, country: req.body.country });
                newUser.save();
                if (newUser) {
                    res.status(200).json({
                        message: 'Signup successful',
                        user: newUser
                    });
                }
            }
            else if (req.body.role == 'admin') {
                const newUser = new Admin_1.default({ firstName: req.body.firstName, lastName: req.body.lastName, email: email, password: userObj[1] });
                newUser.save();
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
                });
            }
            else if (req.body.role == 'electricity supplier') {
                const newUser = new ElectricitySupplier_1.default({ firstName: req.body.firstName, lastName: req.body.lastName, email: email, password: userObj[1] });
                newUser.save();
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
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
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate(req.body.signAs + '-login', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (err || !user) {
                    res.status(400).json({ message: "No user was found" });
                }
                else {
                    req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                        if (error) {
                            res.status(400).json({ message: error });
                        }
                        else {
                            const body = { id: user.id, email: user.email, role: user.role };
                            const token = yield jwt.sign({ user: body }, jwtConfig_1.jwtSecret);
                            return res.status(200).json({ token: token, user: user });
                        }
                    }));
                }
            }
            catch (error) {
                return next(error);
            }
        }))(req, res, next);
    }
    catch (e) {
        next(Error('Could not login'));
    }
});
