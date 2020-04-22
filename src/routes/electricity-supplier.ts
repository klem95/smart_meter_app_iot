import {Router} from "express";
import * as electricitySupplier from '../controller/electricity-supplier'

const electricitySupplierRouter = Router()

electricitySupplierRouter.use('/',electricitySupplier.getDate)

export default electricitySupplierRouter