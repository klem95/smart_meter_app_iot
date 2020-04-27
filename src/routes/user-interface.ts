import {Router} from "express";
import passport from 'passport'
import * as userInterface from '../controller/user-interface'
import * as userInterfaceVal from '../validators/user-interface'
import jsonwebtoken from 'jsonwebtoken'
import * as admin from "../controller/admin";
require('../auth/auth')

const userInterfaceRouter = Router()
const jwt = require('jsonwebtoken');

userInterfaceRouter.get('/crone-ping', admin.cronePing)

userInterfaceRouter.post('/sign-up',userInterfaceVal.signUp,passport.authenticate('signup', {session: false}),userInterface.signUp)
userInterfaceRouter.post('/login', userInterface.login)


export default userInterfaceRouter

