import passport from "passport";
import User from '../models/User'
import {Strategy} from 'passport-jwt'
import {jwtSecret} from '../jwtConfig'
import Admin from "../models/Admin";
import ElectricitySupplier from "../models/ElectricitySupplier";
import {userInterfaceTypes} from "../utils/enums";


const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy;


passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email:string,password:string, done:any) => {
    try{
        const hash = await bcrypt.hash(password, 10);
        const user = {email: email, password: hash}
        //await user.save()
        return done(null,user)
    } catch (e) {
        done(e)
    }
}))

passport.use(userInterfaceTypes.ADMIN+'-login', new localStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async  (email:string, password:string, done:any) => {
    try{
        const adminUser = await Admin.findOne({where:{ email: email}})
        if(!adminUser){
            return done(null, false, { message : 'Email or password was incorrect'})
            console.log("Email or password was incorrect")
        }

        const validPass = await bcrypt.compare(password, adminUser.password);
        if (!validPass) {
            console.log("Email or password was incorrect")
            return done(null, false, { message : 'Email or password was incorrect'})
        }

        return done(null, adminUser, { message : 'Logged in Successfully'});

    }catch (e) {
        done(e)
    }


    }
))

passport.use(userInterfaceTypes.SUPPLIER+'-login', new localStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async  (email:string, password:string, done:any) => {
    try{
        const esUser = await ElectricitySupplier.findOne({where:{email: email}})
        console.log("begin")
        console.log(esUser)
        if(!esUser){
            console.log("no user")
            return done(null, false, { message : 'Email or password was incorrect'})

        }
        const validPass = await bcrypt.compare(password, esUser.password);
        if (!validPass){
            console.log("wrong password")
            return done(null, false, { message : 'Email or password was incorrect'})

        }
        console.log("send")
        return done(null, esUser, { message : 'Logged in Successfully'});
    }catch (e) {
        done(e)
    }
    }
))

passport.use(userInterfaceTypes.CUSTOMER+'-login', new localStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async  (email:string, password:string, done:any) => {
        try{
            const user = await User.findOne({where:{ email: email}})
            if(!user)
                return done(null, false, { message : 'Email or password was incorrect'})
            const validPass = await bcrypt.compare(password, user.password);
            if (!validPass)
                return done(null, false, { message : 'Email or password was incorrect'})
            return done(null, user, { message : 'Logged in Successfully'});
        }catch (e) {
            done(e)
        }
    }
))



passport.use(new JWTstrategy({
    secretOrKey : jwtSecret,
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token:any, done:any) => {
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));