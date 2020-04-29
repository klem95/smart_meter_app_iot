import {NextFunction, Request, Response} from "express";
import passport from 'passport'
import User from "../models/User";
import {validationResult} from "express-validator"
import {jwtSecret} from '../jwtConfig'
import Admin from "../models/Admin";
import ElectricitySupplier from "../models/ElectricitySupplier";


const jwt = require('jsonwebtoken')
require('../auth/auth')

// TEMP SOLUTION... BAD.....
export const signUp = async (req:Request, res: Response, next:NextFunction) : Promise<void> => {
    try{
        const valError = validationResult(req)
        if(valError.isEmpty() && req.user != null) {
            const userObj = Object.values(req.user)
            const email = userObj[0]

            if(req.body.role == 'user') {
                const newUser = new User({firstName: req.body.firstName, lastName: req.body.lastName, email: email, password: userObj[1],  adminId: req.body.adminId, meterId: req.body.meterId,address:req.body.address, country: req.body.country})
                newUser.save()
                if (newUser){
                    res.status(200).json({
                        message: 'Signup successful',
                        user: newUser
                    })
                } else {
                    res.status(400).json({
                        message: 'Could not make user',
                        user: newUser
                    })
                }

            } else if (req.body.role == 'admin') {
                const newUser = new Admin({firstName: req.body.firstName, lastName: req.body.lastName,email: email, password: userObj[1]})
                newUser.save()
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
                })
            } else if (req.body.role == 'electricity supplier') {
                const newUser = new ElectricitySupplier({firstName: req.body.firstName, lastName: req.body.lastName,email: email, password: userObj[1]})
                newUser.save()
                res.status(200).json({
                    message: 'Signup successful',
                    user: newUser
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
                    res.status(400).json({ message: "No user was found"})
                } else {
                    req.login(user, { session : false }, async (error) => {
                        if(error) {
                            res.status(400).json({ message: error})
                        } else {
                            const body = { id : user.id, email : user.email, role: user.role }
                            const token = await jwt.sign({ user : body },jwtSecret)

                            return res.status(200).json({token: token, user: user })
                        }
                    })
                }
            } catch (error) {
                return next(error)
            }
        }) (req,res,next)
    }catch (e) {
        next(Error('Could not login'))
    }
}