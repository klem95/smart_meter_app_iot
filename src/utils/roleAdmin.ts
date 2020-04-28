import {NextFunction, Request, Response} from "express";
import Admin from "../models/Admin";

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
        const role : string = userObj[userObj.length-1]
        if(role != "electricity supplier"){
            res.status(400).json({success: false, message: "Only the electricity supplier has access to this endpoint "})
        } else {
            next()
        }
    }
}