"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
//import WaterMeter from "./model/WaterMeter";
//import {Response,Request} from "express";
const mqttClient = require('./mqtt'); // Subscribing to message broker
const cors = require('cors');
//const router = require('./routes')
const port = process.env.PORT || 3000;
const app = express_1.default();
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.sync();
        console.log(`Server listening on port ${port}`);
    }
    catch (e) {
        console.log('ERROR! Crashed at startup..');
        throw e;
    }
}));
app.use(cors());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
app.use(routes_1.default);
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
//# sourceMappingURL=index.js.map