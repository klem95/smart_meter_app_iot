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
const jwtConfig_1 = require("../jwtConfig");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
passport_1.default.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = yield bcrypt.hash(password, 10);
        const user = { email: email, password: hash };
        //await user.save()
        return done(null, user);
    }
    catch (e) {
        done(e);
    }
})));
passport_1.default.use('admin-login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminUser = yield User_1.default.findOne({ where: { role: 'admin', email: email } });
        if (!adminUser)
            return done(null, false, { message: 'Email or password was incorrect' });
        const validPass = yield bcrypt.compare(password, adminUser.password);
        if (!validPass)
            return done(null, false, { message: 'Email or password was incorrect' });
        return done(null, adminUser, { message: 'Logged in Successfully' });
    }
    catch (e) {
        done(e);
    }
})));
passport_1.default.use('es-login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminUser = yield User_1.default.findOne({ where: { role: 'electricity supplier', email: email } });
        if (!adminUser)
            return done(null, false, { message: 'Email or password was incorrect' });
        const validPass = yield bcrypt.compare(password, adminUser.password);
        if (!validPass)
            return done(null, false, { message: 'Email or password was incorrect' });
        return done(null, adminUser, { message: 'Logged in Successfully' });
    }
    catch (e) {
        done(e);
    }
})));
passport_1.default.use(new JWTstrategy({
    secretOrKey: jwtConfig_1.jwtSecret,
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return done(null, token.user);
    }
    catch (error) {
        done(error);
    }
})));
//# sourceMappingURL=auth.js.map