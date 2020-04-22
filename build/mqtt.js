"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt = require('mqtt');
const decode = require('./decoder');
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
    const decodedMessage = decode.decodePackage(message);
    console.log(decodedMessage);
});
client.subscribe(topic);
exports.default = client;
//# sourceMappingURL=mqtt.js.map