import {checkSchema} from 'express-validator'
import SmartMeterSample from "../models/Smart-meter-sample";
import User from "../models/User";

export const ReturnSamples = checkSchema({
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