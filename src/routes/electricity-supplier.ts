import {Router} from "express";
import * as electricitySupplier from '../controller/electricity-supplier'
import * as esValidators from '../validators/es'
const electricitySupplierRouter = Router()

electricitySupplierRouter.get('/generate-model',esValidators.generateModel,electricitySupplier.generateModel)
electricitySupplierRouter.get('/predict/:id',esValidators.getPredictions,electricitySupplier.getPredictions)

export default electricitySupplierRouter