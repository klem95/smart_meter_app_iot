import {NextFunction, Request, Response} from "express";
import SmartMeterSample from "../models/Smart-meter-sample";
import {train, predictFuture,LSTMmodel} from "../utils/LSTM-model";
import {validationResult} from "express-validator";
import User from "../models/User";
import Admin from "../models/Admin";
import sequelize, {Op} from "sequelize";
import {convertTime} from "../utils/timeConverter";
import {modelTraining} from "../utils/LSTM-model";

export const getAdminsAndUsers = async (req:Request,res:Response, next:NextFunction) : Promise<void> => {
    try {
        const admins = await Admin.findAll()
        let users : User [] = []

        if (admins.length > 0) {
            console.log(admins.length )
            for (let i = 0; i < admins.length; i++){
                const adminId = admins[i].id
                let _users = await User.findAll({where:{adminId:adminId}})
                console.log(_users )
                _users.forEach(value => {
                    users.push(value)
                })
            }
            res.status(200).json({success:true,result:{admins: admins, customers:users}})

        } else{
            res.status(400).json({message:'no admins were found'})
        }

    } catch (e) {
        next(new Error('Error! Could not retrive admins and users'))
    }
}


export const generateModel = async (req:Request,res:Response, next:NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty() ){
            if (!modelTraining){
                const epochsNo : number = parseInt(req.query.epochsNo.toString())
                const learningRate : number = parseFloat(req.query.learningRate.toString())
                const hiddenLayers : number = parseInt(req.query.hiddenLayers.toString())
                const windowSize : number = parseInt(req.query.windowSize.toString())
                const meterId : number = parseInt(req.query.meterId.toString())
                const waterSamples = await SmartMeterSample.findAll({where:{meterId:meterId}})

                const result = await train(waterSamples,epochsNo,learningRate,hiddenLayers,windowSize)
                res.status(200).json({success: true, result: "Model is trained"})
            } else {
                res.status(503).json({message: "Model is already being trained. Please wait..."})
            }
        } else {
            res.status(400).json({error: valError})
        }
    }catch (e) {
        next(new Error('Error! Could not build model'))
    }

}

export const getPredictions = async (req:Request,res:Response, next:NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError) {
            if(LSTMmodel != undefined) {
                const user = await User.findOne({where:{id: req.params.id}})
                const meterId = user?.meterId
                if (meterId != undefined){
                    const meterData = await SmartMeterSample.findAll({where:{meterId: meterId}})


                    const prediction = await predictFuture(meterData)
                    res.status(200).json({prediction})
                }
            } else {
                res.status(400).json({error: "Please train model"})
            }
        } else {
            res.status(400).json({error: valError})
        }
    }catch (e) {
        console.log(e)
        res.status(400).json({error: e})
    }

}

export const ReturnSamples = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const valError = validationResult(req)
        if (valError.isEmpty()){
            console.log(req.body)
            const user = await User.findOne({where:{id: req.params.id}})
            if (user){
                let startDate : any = new Date(req.query.startDate.toString())
                let endDate : any = new Date(req.query.endDate.toString())
                startDate = await convertTime(startDate,false)
                endDate = await convertTime(endDate,true)
                const smartMeterSamples = await SmartMeterSample.findAll({where:{meterId: user.meterId, date:{ [Op.between]: [startDate, endDate]} }})
                if (smartMeterSamples.length != 0){
                    res.status(200).json({success: true, result: {smartMeterSamples}})
                } else {
                    const smsStart = await SmartMeterSample.findOne({attributes:[[sequelize.fn('min',sequelize.col('date')),'min']]})
                    const smsEnd = await SmartMeterSample.findOne({attributes:[[sequelize.fn('max',sequelize.col('date')),'max']]})
                    res.status(400).json({ err: 'no samples found within the provided date range', samplePeriod: {first: smsStart, last: smsEnd}})
                }
            } else {
                res.status(400).json({ err: 'no user was found'})

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

            const user = await User.findOne({where:{id: req.params.id}})
            if (user){
                let startDate : any = new Date(req.query.startDate.toString())
                let endDate : any = new Date(req.query.endDate.toString())
                startDate = await convertTime(startDate,false)
                endDate = await convertTime(endDate,true)
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