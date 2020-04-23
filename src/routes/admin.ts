import {Router} from 'express'
import * as admin from '../controller/admin'
import * as adminValidators from '../validators/admin'

const adminRouter = Router()

adminRouter.get('/avg-wh/:id',adminValidators.avgWH, admin.avgWH)
adminRouter.post('/return-samples',adminValidators.ReturnSamples, admin.ReturnSamples)


export default adminRouter