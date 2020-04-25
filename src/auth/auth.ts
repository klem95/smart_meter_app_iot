import passport from "passport";
import User from '../model/User'
import {Strategy} from 'passport-jwt'
import {jwtSecret} from '../jwtConfig'

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

passport.use('admin-login', new localStrategy({
    usernameField : 'email',
    passwordField : 'password'
}, async  (email:string, password:string, done:any) => {
    try{
        const adminUser = await User.findOne({where:{role: 'admin', email: email}})
        if(!adminUser)
            return done(null, false, { message : 'Email or password was incorrect'})
        const validPass = await bcrypt.compare(password, adminUser.password);
        if (!validPass)
            return done(null, false, { message : 'Email or password was incorrect'})
        return done(null, adminUser, { message : 'Logged in Successfully'});
    }catch (e) {
        done(e)
    }


    }
))

passport.use('es-login', new localStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async  (email:string, password:string, done:any) => {
    try{
        const adminUser = await User.findOne({where:{role: 'electricity supplier', email: email}})
        if(!adminUser)
            return done(null, false, { message : 'Email or password was incorrect'})
        const validPass = await bcrypt.compare(password, adminUser.password);
        if (!validPass)
            return done(null, false, { message : 'Email or password was incorrect'})
        return done(null, adminUser, { message : 'Logged in Successfully'});
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