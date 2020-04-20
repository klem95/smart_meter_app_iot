import express from "express"
import WaterMeter from "./models/WaterMeter";
import {Response,Request} from "express";
import {seq} from "./db";

const port = process.env.PORT || 3000
let app = express();

//sequelize.sync()

app.use('/', async (req:Request,res:Response) : Promise<void> => {
    try {


        const test = new WaterMeter({
            name: "hans",
            birthday: "21"
        })
        test.save()

        const all = await WaterMeter.findAll()




        res.send(all)
    }catch (e) {
        res.send(e.toString())
        throw e
    }

});

app.listen(port, async () => {
    try {
        await seq.sync()
        console.log(`Server listening on port ${port}`);
        console.log("hello")
    } catch (e) {
        console.log('ERROR!')
        throw e
    }
});

