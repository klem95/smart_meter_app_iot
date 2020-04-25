import {NextFunction, Request, Response} from "express";
import passport from 'passport'
import User from "../model/User";
import {validationResult} from "express-validator"
import {jwtSecret} from '../jwtConfig'

const jwt = require('jsonwebtoken')
require('../auth/auth')

export const signUp = async (req:Request, res: Response, next:NextFunction) : Promise<void> => {
    try{
        const valError = validationResult(req)
        if(valError.isEmpty() && req.user != null) {
            const userObj = Object.values(req.user)
            const email = userObj[0]
            const dbObj = await User.findOne({where:{email:email, role: req.body.role}})
            if(dbObj == null){
                const newUser = new User({email: email, password: userObj[1], role:req.body.role})
                newUser.save()
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
                })
            } else {
                res.status(200).json({
                    message: 'User already exist'
                })
            }
        } else {
            res.status(400).json({ err: valError})
        }

    } catch (e) {
        console.log(e)
        next(Error('Could not sign up new user...'))

    }
}

export const login = async (req:Request, res:Response, next:NextFunction) : Promise<void> =>{
    try{
        passport.authenticate(req.body.signAs +'-login', async (err, user, info) => {
            try {
                if(err || !user){
                    res.status(400).json({success: false, message: "No existing user matches the provided parameters"});
                }
                req.login(user, { session : false }, async (error) => {
                    if(error)
                        return next(error)
                    const body = { id : user.id, email : user.email, role: user.role }
                    const token = jwt.sign({ user : body },jwtSecret)
                    return res.status(200).json({ token })
                })
            } catch (error) {
                return next(error)
            }
        }) (req,res,next)
    }catch (e) {
        next(Error('Could not login'))
    }
}