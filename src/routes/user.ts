import {Router} from "express";
import * as user from '../controller/user'

const userRouter = Router()

userRouter.get('/',user.getDate)

export default userRouter