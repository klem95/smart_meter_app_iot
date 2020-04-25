import {Router} from "express";
import passport from 'passport'
import * as userInterface from '../controller/user-interface'
import * as userInterfaceVal from '../validators/user-interface'
import jsonwebtoken from 'jsonwebtoken'
require('../auth/auth')

const userInterfaceRouter = Router()
const jwt = require('jsonwebtoken');

userInterfaceRouter.post('/sign-up',userInterfaceVal.signUp,passport.authenticate('signup', {session: false}),userInterface.signUp)
userInterfaceRouter.post('/admin-login', userInterface.login)
userInterfaceRouter.post('/es-login', userInterface.login)


export default userInterfaceRouter

