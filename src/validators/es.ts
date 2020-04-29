import {checkSchema} from 'express-validator'
import User from "../models/User";


export const generateModel = checkSchema({
    meterId: {
        in: ["query"],
        isInt: true,
        errorMessage: 'meterId has to be of type int',
        custom: {
            options: async val => {
                if (await User.count({where:{meterId: val}}) === 0)
                    return Promise.reject()
            },
            errorMessage: 'The provided id does not match any meter'
        }
    },

    epochsNo: {
        in: ["query"],
        isInt: {
            options: [{ min: 1, max: 5000 }],
        },
        errorMessage: 'epochsNo has to be of type int (min: 1, max: 5000)',
    },
    learningRate: {
        in: ["query"],
        isFloat: {
            options: [{ min: 0.0005, max: 1000 }],
        },
        errorMessage: 'learningRate has to be of type float (min: 0.0005, max: 1000)'
    },
    hiddenLayers: {
        in: ["query"],
        isFloat: {
            options: [{ min: 1, max: 100 }],
        },
        errorMessage: 'hiddenLayers has to be of type int  (min: 1, max: 100)'
    },
    windowSize: {
        in: ["query"],
        isFloat: {
            options: [{ min: 1, max: 2000 }],
        },
        errorMessage: 'windowSize has to be of type int  (min: 1, max: 2000)'
    }

})