import {Router} from 'express'
import * as admin from '../controller/admin'
import * as adminValidators from '../validators/admin'

const adminRouter = Router()

adminRouter.post('/get-sm-data',adminValidators.returnSmData, admin.returnSmData)

export default adminRouter