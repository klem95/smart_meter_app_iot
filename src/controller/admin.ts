import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import SmartMeterSample from "../model/Smart-meter-sample";

export const returnSmData = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty()){
            res.status(200).json({success: true, message: 'gj m8'})
        } else{
            res.status(400).json({ err: valError})
        }
    } catch (e) {
        next(new Error('Error! Could not return sample data'))
    }
}