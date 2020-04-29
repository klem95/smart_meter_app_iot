import {Router} from "express";
import * as electricitySupplier from '../controller/electricity-supplier'
import * as esValidators from '../validators/es'
const electricitySupplierRouter = Router()

electricitySupplierRouter.get('/generateModel',esValidators.generateModel,electricitySupplier.generateModel)
electricitySupplierRouter.get('/predict',esValidators.generateModel,electricitySupplier.getPredictions)

export default electricitySupplierRouter