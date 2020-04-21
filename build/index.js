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
const WaterMeter_1 = __importDefault(require("./models/WaterMeter"));
const db_1 = require("./db");
const port = process.env.PORT || 3000;
let app = express_1.default();
const mqtt = require('mqtt');
const client = mqtt.connect('influx.itu.dk');
console.log(client);
//const test = "postgres://hupjaeyicqwihd:5b9c69ae13bb8bf3f8fb4af620fdc42ce74257872ec4a9336a0e43dfe5fc83e4@ec2-79-125-26-232.eu-west-1.compute.amazonaws.com:5432/d6dti5957svigc"
//sequelize.sync()
app.use('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = new WaterMeter_1.default({
            name: "hans",
            birthday: "21"
        });
        test.save();
        const all = yield WaterMeter_1.default.findAll();
        res.send(all);
    }
    catch (e) {
        res.send(e.toString());
        console.log("im running with error");
        throw e;
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(process.env.DATABASE_URL);
        //let re = test.match(/\/\w*:/); // user
        //let re = test.match(/\:[\w]*@/); // password
        //let re = test.match(/\@.*:/); // host
        // let re = test.match(/\:[0-9]{4}/); // port
        //let re = test.split('/')// db name
        //if (re != null) sad
        //console.log(re[0].substring(1, re[0].length-1));
        console.log(db_1.seq);
        yield db_1.seq.sync();
        console.log(`Server listening on port ${port}`);
    }
    catch (e) {
        console.log('ERROR!');
        throw e;
    }
}));
//# sourceMappingURL=index.js.map