import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import SmartMeterSample from "../model/Smart-meter-sample";
import sequelize, {Op} from 'sequelize'

export const ReturnSamples = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty()){
            const smartMeterSamples = await SmartMeterSample.findAll({where:{meterId: req.body.meterId, date:{[Op.between]: [req.body.startDate, req.body.endDate]}}})
            if (smartMeterSamples.length != 0){
                res.status(200).json({success: true, message: smartMeterSamples})
            } else {
                const smsStart = await SmartMeterSample.findOne({attributes:[[sequelize.fn('min',sequelize.col('date')),'min']]})
                const smsEnd = await SmartMeterSample.findOne({attributes:[[sequelize.fn('max',sequelize.col('date')),'max']]})
                res.status(400).json({ err: 'no samples found within the provided date range', samplePeriod: {first: smsStart, last: smsEnd}})
            }
        } else{
            res.status(400).json({ err: valError})
        }
    } catch (e) {
        next(new Error('Error! Could not return sample data'))
    }
}

export const avgWH = async (req:Request, res:Response, next: NextFunction) : Promise<void> => {
    try{
        const valError = validationResult(req)
        if (valError.isEmpty()){
            const smartMeterSamples = await SmartMeterSample.findAll({where: {meterId: req.params.id}})
            let totalWH : number = 0

            smartMeterSamples.forEach(val =>{
                totalWH += val.wattsPerHour
            })

            totalWH = totalWH / smartMeterSamples.length
            res.status(200).json({success: true, avg: totalWH})
        } else {
            res.status(400).json({ err: valError})
        }
    } catch (e) {
        next(new Error('Error! Could not return ranking'))
    }
}