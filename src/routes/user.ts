import {Router} from "express";
import * as user from '../controller/user'
import * as userVal from  '../validators/user'

const userRouter = Router()

userRouter.get('/return-samples',userVal.ReturnSamples,user.ReturnSamples)
userRouter.get('/avg-spending',userVal.avgSpending,user.avgSpending)

export default userRouter