import {Router} from 'express'
import * as admin from '../controller/admin'
import * as adminValidators from '../validators/admin'

const adminRouter = Router()

adminRouter.get('/crone-ping', admin.cronePing)

adminRouter.get('/avg-spending/:id',adminValidators.avgSpending, admin.avgSpending)
adminRouter.post('/return-samples',adminValidators.ReturnSamples, admin.ReturnSamples)


export default adminRouter