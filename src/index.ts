import express from "express"
import WaterMeter from "./models/WaterMeter";
import {Response,Request} from "express";
import {seq} from "./db";

const port = process.env.PORT || 3000
let app = express();

const test = "postgres://hupjaeyicqwihd:5b9c69ae13bb8bf3f8fb4af620fdc42ce74257872ec4a9336a0e43dfe5fc83e4@ec2-79-125-26-232.eu-west-1.compute.amazonaws.com:5432/d6dti5957svigc"

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
        console.log("im running with error")
        throw e
    }

});

app.listen(port, async () => {
    try {
        console.log(process.env.DATABASE_URL);
         //let re = test.match(/\/\w*:/); // user
         //let re = test.match(/\:[\w]*@/); // password
        //let re = test.match(/\@.*:/); // host
        // let re = test.match(/\:[0-9]{4}/); // port
        //let re = test.split('/')// db name
        //if (re != null)
        //console.log(re[0].substring(1, re[0].length-1));
        console.log(seq)
        await seq.sync()
        console.log(`Server listening on port ${port}`);

    } catch (e) {
        console.log('ERROR!')
        throw e
    }
});

