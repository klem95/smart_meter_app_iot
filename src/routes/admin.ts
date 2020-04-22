import {Router} from 'express'
import * as admin from '../controller/admin'

const adminRouter = Router()

adminRouter.get('/', admin.getData)

export default adminRouter