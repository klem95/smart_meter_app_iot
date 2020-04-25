import {Request, Response, Router} from 'express'
import adminRouter from "./admin"
import userRouter from "./user"
import electricitySupplierRouter from "./electricity-supplier";
import userInterfaceRouter from "./user-interface";

const mainRouter = Router()

mainRouter.use('/admin', adminRouter) // Mounts the route as middleware
mainRouter.use('/user', userRouter)
mainRouter.use('/electricitySupplier', electricitySupplierRouter)
mainRouter.use('/user-interface', userInterfaceRouter)


mainRouter.get('/*', (req:Request, res:Response) => {
    res.status(404).send('404. This endpoint does not exist')
})



export default mainRouter