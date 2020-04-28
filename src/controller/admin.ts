import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import SmartMeterSample from "../models/Smart-meter-sample";
import sequelize, {Op} from 'sequelize'
import querystring from 'querystring';
import Admin from "../models/Admin";
import User from "../models/User";

export const cronePing = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    res.status(200).json({success: true})
}

export const returnUsers = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty()){
            const users = await User.findAll({where: {adminId: req.body.id}})
            if (users){
                res.status(200).json({success: true, result: users})
            } else {
                res.status(400).json({ err: 'no associated users could be found'})
            }
        } else {
            res.status(400).json({ err: 'Could not return associated users'})
        }

    }catch (e) {
        next(new Error('Error! Could not return sample data'))
    }
}
export const ReturnSamples = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty()){
            console.log(req.body)
            const user = await User.findOne({where:{id: req.params.id, adminId: req.body.id}})
            if (user){
                const startDate : any = new Date(req.query.startDate.toString())
                const endDate : any = new Date(req.query.endDate.toString())
                const smartMeterSamples = await SmartMeterSample.findAll({where:{meterId: user.meterId, date:{ [Op.between]: [startDate, endDate]} }})
                if (smartMeterSamples.length != 0){
                    res.status(200).json({success: true, result: {smartMeterSamples}})
                } else {
                    const smsStart = await SmartMeterSample.findOne({attributes:[[sequelize.fn('min',sequelize.col('date')),'min']]})
                    const smsEnd = await SmartMeterSample.findOne({attributes:[[sequelize.fn('max',sequelize.col('date')),'max']]})
                    res.status(400).json({ err: 'no samples found within the provided date range', samplePeriod: {first: smsStart, last: smsEnd}})
                }
            } else {
                res.status(400).json({ err: 'no user with the given id belongs to this admin profile'})

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

            const user = await User.findOne({where:{id: req.params.id, adminId: req.body.id}})
            if (user){
                const startDate : any = new Date(req.query.startDate.toString())
                const endDate : any = new Date(req.query.endDate.toString())
                const smartMeterSamples = await SmartMeterSample.findAll({where:{meterId: user.meterId, date:{ [Op.between]: [startDate, endDate]} }})
                if (smartMeterSamples.length != 0){
                    let totalWh : number = 0
                    let KWhPrice : number = 2.25
                    let noOfSamples : number = 0

                    smartMeterSamples.forEach(val =>{
                        totalWh += val.wattsPerHour
                        noOfSamples ++
                    })

                    const avgKWh = (totalWh / noOfSamples) / 1000
                    const totalSpending = (totalWh / 1000) * KWhPrice

                    res.status(200).json({success: true, result: {avgKWh: avgKWh, totalSpending: totalSpending}})
                } else {
                    const smsStart = await SmartMeterSample.findOne({attributes:[[sequelize.fn('min',sequelize.col('date')),'min']]})
                    const smsEnd = await SmartMeterSample.findOne({attributes:[[sequelize.fn('max',sequelize.col('date')),'max']]})
                    res.status(400).json({ err: 'no samples found within the provided date range', samplePeriod: {first: smsStart, last: smsEnd}})
                }
            } else {
                res.status(400).json({ err: 'no user with the given id belongs to this admin profile'})
            }
        } else {
            res.status(400).json({ err: valError})
        }


    } catch (e) {
        next(new Error('Error! Could not return ranking'))
    }
}