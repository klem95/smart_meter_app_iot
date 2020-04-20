import express from "express"
import WaterMeter from "./models/WaterMeter";
import { sequelize } from './db'
import {Response,Request} from "express";

const PORT = 8080;

let app = express();

sequelize.sync()

app.use('/', async (req:Request,res:Response) : Promise<void> => {
    try {
        await sequelize.sync()
        const test = new WaterMeter({
            name: "hans",
            birthday: "21"
        })
        test.save()

        const all = await WaterMeter.findAll()


        res.send(all)
    }catch (e) {
        throw e
    }

});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log("hello")
});

