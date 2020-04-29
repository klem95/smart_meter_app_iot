import {Router} from "express";
import * as electricitySupplier from '../controller/electricity-supplier'
import * as esValidators from '../validators/es'

const electricitySupplierRouter = Router()

electricitySupplierRouter.get('/',electricitySupplier.getAdminsAndUsers)
electricitySupplierRouter.get('/generate-model',esValidators.generateModel,electricitySupplier.generateModel)
electricitySupplierRouter.get('/predict/:id',esValidators.getPredictions,electricitySupplier.getPredictions)
electricitySupplierRouter.get('/return-samples/:id',esValidators.ReturnSamples, electricitySupplier.ReturnSamples)
electricitySupplierRouter.get('/avg-spending/:id',esValidators.avgSpending, electricitySupplier.avgSpending)

export default electricitySupplierRouter