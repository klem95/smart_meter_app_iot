import {NextFunction, Request, Response} from "express";
import SmartMeterSample from "../models/Smart-meter-sample";
import {train, predictFuture,LSTMmodel} from "../utils/LSTM-model";
import {validationResult} from "express-validator";
import User from "../models/User";
import Admin from "../models/Admin";

export const getAdminsAndUsers = async (req:Request,res:Response, next:NextFunction) : Promise<void> => {
    try {
        const admins = await Admin.findAll()
        let users : User [] = []

        if (admins.length > 0) {
            for (let i = 0; i < admins.length; i++){
                const adminId = admins[i].id
                const _users = await User.findAll({where:{adminId:adminId}})
                _users.forEach(value => {
                    users.push(value)
                })
                res.status(200).json({success:true,result:{admins: admins, users:users}})
            }
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
        if (valError.isEmpty()){
            const epochsNo : number = parseInt(req.query.epochsNo.toString())
            const learningRate : number = parseFloat(req.query.learningRate.toString())
            const hiddenLayers : number = parseInt(req.query.hiddenLayers.toString())
            const windowSize : number = parseInt(req.query.windowSize.toString())
            const meterId : number = parseInt(req.query.meterId.toString())
            const waterSamples = await SmartMeterSample.findAll({where:{meterId:meterId}})

            const result = await train(waterSamples,epochsNo,learningRate,hiddenLayers,windowSize)
            res.status(200).json({success: true, result: "Model is trained"})
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
                console.log(user)
                if (meterId != undefined){
                    const meterData = await SmartMeterSample.findAll({where:{meterId: meterId}})

                    const predictions = await predictFuture(meterData)
                    res.status(200).json({predictions})
                }
            } else {
                res.status(400).json({error: "Please train model"})
            }
        } else {
            res.status(400).json({error: valError})
        }
    }catch (e) {
        console.log(e)
        next(new Error('Error! Could not generate predictions'))
    }

}
