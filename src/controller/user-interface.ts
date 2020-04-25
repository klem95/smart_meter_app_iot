import {NextFunction, Request, Response} from "express";
import passport from 'passport'
import User from "../model/User";
import {validationResult} from "express-validator";

const jwt = require('jsonwebtoken')

export const signUp = async (req:Request, res: Response, next:NextFunction) : Promise<void> => {
    try{
        const valError = validationResult(req)
        if(valError.isEmpty() && req.user != null) {
            const userObj = Object.values(req.user)
            const email = userObj[0]
            const dbObj = await User.findOne({where:{email:email, role: req.body.role}})
            console.log(dbObj)
            if(dbObj == null){
                const newUser = new User({email: email, password: userObj[1], role:req.body.role})
                newUser.save()
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
                })
                console.log("Create new users")
            } else {
                console.log("User already exist")
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