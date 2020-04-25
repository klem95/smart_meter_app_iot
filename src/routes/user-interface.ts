import {Router} from "express";
import passport from 'passport'
import * as userInterface from '../controller/user-interface'
import * as userInterfaceVal from '../validators/user-interface'

require('../auth/auth')

const userInterfaceRouter = Router()

userInterfaceRouter.post('/',userInterfaceVal.signUp,passport.authenticate('signup', {session: false}),userInterface.signUp)

export default userInterfaceRouter

