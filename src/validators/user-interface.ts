import {checkSchema} from 'express-validator'
import User from "../models/User";
import {roleArr} from '../utils/enums'

export const signUp = checkSchema({
    email: {
        in: ["body"],
        isEmail: true,
        errorMessage: "email needs to of appropriate format"
    },
    password: {
        in: ["body"],
        isString: true,
        isLength: {
            options: [{ min: 5, max: 25 }],
        },
        errorMessage: "password needs to be of type string, and be between 5-25 char"
    },
    role:{
        in:["body"],
        isIn: {
            options: [roleArr],
        },
        errorMessage: "role needs to be one of the following: " + roleArr
    }
})