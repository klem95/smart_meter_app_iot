import {Request, Response} from "express";

export const getDate = async (req:Request, res:Response) : Promise<void> => {
    res.send('User')
}