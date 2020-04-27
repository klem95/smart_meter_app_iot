import {checkSchema} from 'express-validator'
import SmartMeterSample from "../model/Smart-meter-sample";
import User from "../model/User";

export const ReturnSamples = checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        errorMessage: "meterId needs to be of type int.",
        custom: {
            options: async val => {
                if (await User.count({where:{id: val}}) === 0)
                return Promise.reject()
            },
            errorMessage: 'The provided id does not match any user'
        }
    },

    startDate: {
        in: ['query'],
        isISO8601: true,
        errorMessage: "startDate needs to be of type date: yyyy-mm-dd",
    },

    endDate: {
        in: ['query'],
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