import {checkSchema} from 'express-validator'
import SmartMeterSample from "../model/Smart-meter-sample";

export const ReturnSamples = checkSchema({
    meterId: {
        in: ['body'],
        isInt: true,
        errorMessage: "meterId needs to be of type int",
        custom: {
            options: async val => {
                if (await SmartMeterSample.count({where:{meterId: val}}) === 0)
                return Promise.reject()
            },
            errorMessage: 'The provided id does not match any meter'
        }
    },

    startDate: {
        in: ['body'],
        isISO8601: true,
        errorMessage: "startDate needs to be of type date: yyyy-mm-dd",
    },

    endDate: {
        in: ['body'],
        isISO8601: true,
        errorMessage: "endDate needs to be of type date: yyyy-mm-dd"
    }
})

export const avgSpending = checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: "meterId needs to be of type int",
        custom: {
            options: async val => {
                if (await SmartMeterSample.count({where:{meterId: val}}) === 0)
                    return Promise.reject()
            },
            errorMessage: 'The provided id does not match any meter'
        }
    },

})