"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decoder_1 = require("./utils/decoder");
const Smart_meter_sample_1 = __importDefault(require("./model/Smart-meter-sample"));
const mqtt = require('mqtt');
const brokeUrl = "mqtts://influx.itu.dk";
const options = {
    port: 8883,
    username: "smartreader",
    password: "4mp3r3h0ur"
};
const topic = "IoT2020sec/meters";
const client = mqtt.connect(brokeUrl, options);
console.log("connected flag:  " + client.connected);
//console.log(client)
client.on("connect", function () {
    console.log("connected:  " + client.connected);
});
client.on("error", function (error) {
    console.log("Can't connect: " + error);
    process.exit(1);
});
client.on('message', function (topic, message, packet) {
    const decodedMessage = decoder_1.decodePackage(message);
    if (decodedMessage.authenticSample) {
        const smartMeterSample = new Smart_meter_sample_1.default({
            meterId: decodedMessage.meterId,
            authenticSample: decodedMessage.authenticSample,
            date: decodedMessage.date,
            wattsPerHour: decodedMessage.wattsPerHour
        });
        smartMeterSample.save();
    }
});
client.subscribe(topic);
exports.default = client;
