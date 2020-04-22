import {NextFunction, Request, Response} from "express";


export const getData = async (req:Request, res:Response, next:NextFunction) : Promise<void> => {
    res.send('admin')
}