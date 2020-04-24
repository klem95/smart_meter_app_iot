import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import SmartMeterSample from "../model/Smart-meter-sample";
import sequelize, {Op} from 'sequelize'

export const cronePing = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    res.status(200).json({success: true})
}

export const ReturnSamples = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty()){
            const smartMeterSamples = await SmartMeterSample.findAll({where:{meterId: req.params.id, date:{[Op.between]: [req.query.startDate, req.query.endDate]}}})
            if (smartMeterSamples.length != 0){
                res.status(200).json({success: true, result: {smartMeterSamples}})
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

export const avgSpending = async (req:Request, res:Response, next: NextFunction) : Promise<void> => {
    try{
        const valError = validationResult(req)
        if (valError.isEmpty()){
            const smartMeterSamples = await SmartMeterSample.findAll({where: {meterId: req.params.id}})
            let totalWh : number = 0
            let avgKWhPrice : number = 2.25

            smartMeterSamples.forEach(val =>{
                totalWh += val.wattsPerHour
            })


            avgKWhPrice = (totalWh / 1000) * avgKWhPrice
            const avgWh = totalWh / smartMeterSamples.length
            res.status(200).json({success: true, result: {avgWh: avgWh, avgSpending: avgKWhPrice}})
        } else {
            res.status(400).json({ err: valError})
        }
    } catch (e) {
        next(new Error('Error! Could not return ranking'))
    }
}