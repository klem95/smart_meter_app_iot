import {NextFunction, Request, Response} from "express";
import SmartMeterSample from "../models/Smart-meter-sample";
import {train, predictFuture,LSTMmodel} from "../utils/LSTM-model";
import {validationResult} from "express-validator";

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
        if(LSTMmodel != undefined) {
            const predictions = await predictFuture()
            res.status(200).json({predictions})
        } else {
            res.status(400).json({error: "Please train model"})
        }

    }catch (e) {
        console.log(e)
        next(new Error('Error! Could not generate predictions'))
    }

}
