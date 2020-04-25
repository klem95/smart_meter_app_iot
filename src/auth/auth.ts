import passport from "passport";
import User from '../model/User'


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