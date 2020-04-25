import {NextFunction, Request, Response} from "express";

export const adminCheck = async (req:Request,res:Response, next:NextFunction) : Promise <void> =>{
    if (req.user != null){
        const userObj = Object.values(req.user)
        const role : string = userObj[userObj.length-1]
        if(role != "admin"){
            res.status(400).json({success: false, message: "Only admins have access to this endpoint "})
        } else {
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