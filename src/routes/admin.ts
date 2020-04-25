import {Router} from 'express'
import * as admin from '../controller/admin'
import * as adminValidators from '../validators/admin'
import passport from 'passport'

const adminRouter = Router()

adminRouter.get('/crone-ping', admin.cronePing)

adminRouter.get('/avg-spending/:id',adminValidators.avgSpending, admin.avgSpending)
adminRouter.get('/return-samples/:id',adminValidators.ReturnSamples, admin.ReturnSamples)


export default adminRouter