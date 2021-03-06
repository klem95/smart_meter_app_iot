import {Router} from 'express'
import * as admin from '../controller/admin'
import * as adminValidators from '../validators/admin'
import passport from 'passport'

const adminRouter = Router()

adminRouter.get('/avg-spending/:id',adminValidators.avgSpending, admin.avgSpending)
adminRouter.get('/return-users', admin.returnUsers)
adminRouter.get('/return-samples/:id',adminValidators.ReturnSamples, admin.ReturnSamples)
// test


export default adminRouter