import {NextFunction, Request, Response, Router} from 'express'
import adminRouter from "./admin"
import userRouter from "./user"
import electricitySupplierRouter from "./electricity-supplier";
import userInterfaceRouter from "./user-interface";
import passport from "passport";
import {adminCheck,electricitySupplierCheck} from "../utils/roleAdmin";

const mainRouter = Router()

mainRouter.use('/admin',passport.authenticate('jwt', { session : false }),adminCheck, adminRouter) // Mounts the route as middleware
//mainRouter.use('/admin', adminRouter) // Mounts the route as middleware

mainRouter.use('/user', userRouter)
mainRouter.use('/electricitySupplier',passport.authenticate('jwt', { session : false }),electricitySupplierCheck, electricitySupplierRouter)
mainRouter.use('/user-interface', userInterfaceRouter)


mainRouter.get('/*', (req:Request, res:Response) => {
    res.status(404).send('404. This endpoint does not exist')
})



export default mainRouter