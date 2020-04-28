import {Router} from "express";
import * as electricitySupplier from '../controller/electricity-supplier'

const electricitySupplierRouter = Router()

electricitySupplierRouter.get('/',electricitySupplier.getDate)

export default electricitySupplierRouter