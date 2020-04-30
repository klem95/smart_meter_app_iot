import express from "express"
import sequelize from "./db";
import mainRouter from "./routes";
import bodyParser from 'body-parser'
import passport from "passport";

//import WaterMeter from "./model/WaterMeter";
//import {Response,Request} from "express";

const mqttClient = require('./mqtt') // Subscribing to message broker
const cors = require('cors')

//const router = require('./routes')
const port = process.env.PORT || 3000
const app = express()



const server = app.listen(port, async () : Promise<void> =>  {
    try {
        await sequelize.sync()

        console.log(`Server listening on port ${port}`);
    } catch (e) {
        console.log('ERROR! Crashed at startup..')
        throw e
    }
});

export const io = require('socket.io')(server);

io.on('connection', (socket:any) => {
    socket.on('chat message', (msg:any) => {
        console.log('message: ' + msg);
    });
});



app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(passport.initialize())
app.use(express.json())
app.use(mainRouter)


//const test = "postgres://hupjaeyicqwihd:5b9c69ae13bb8bf3f8fb4af620fdc42ce74257872ec4a9336a0e43dfe5fc83e4@ec2-79-125-26-232.eu-west-1.compute.amazonaws.com:5432/d6dti5957svigc"

//seq.sync()

/*


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

 */

