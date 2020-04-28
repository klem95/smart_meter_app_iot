import {NextFunction, Request, Response} from "express";
import Admin from "../models/Admin";
import ElectricitySupplier from "../models/ElectricitySupplier";
import User from "../models/User";


export const adminCheck = async (req:Request,res:Response, next:NextFunction) : Promise <void> =>{
    if (req.user != null){
        const userObj = Object.values(req.user)
        const adminId = userObj[0]
        const adminEmail = userObj[1]
        const adminUser = await Admin.count({where:{id:adminId, email:adminEmail}})

        if(adminUser === 0){
            res.status(400).json({success: false, message: "Only admins have access to this endpoint "})
        } else {
            req.body.id = adminId
            req.body.email = adminEmail
            next()
        }
    }
}

export const electricitySupplierCheck = async (req:Request,res:Response, next:NextFunction) : Promise <void> =>{
    if (req.user != null){
        const userObj = Object.values(req.user)
        const esId = userObj[0]
        const esMail = userObj[1]
        const esUser = await ElectricitySupplier.count({where:{id:esId, email:esMail}})

        if(esUser === 0){
            res.status(400).json({success: false, message: "Only the electricity supplier has access to this endpoint "})
        } else {
            req.body.id = esId
            req.body.email = esMail
            next()
        }
    }
}

export const customerCheck = async (req:Request,res:Response, next:NextFunction) : Promise <void> =>{
    if (req.user != null){
        const userObj = Object.values(req.user)
        const customerId = userObj[0]
        const customerMail = userObj[1]
        const customerUser = await User.count({where:{id:customerId, email:customerMail}})
        if(customerUser === 0){
            res.status(400).json({success: false, message: "Only the customers supplier has access to this endpoint "})
        } else {
            req.body.id = customerId
            req.body.email = customerMail
            next()
        }
    }
}