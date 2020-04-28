import {decodePackage} from './utils/decoder'
import SmartMeterSample from "./models/Smart-meter-sample";
const mqtt = require('mqtt')


const brokeUrl = "mqtts://influx.itu.dk"
const options = {
    port: 8883,
    username:"smartreader",
    password:"4mp3r3h0ur"
}
const topic="IoT2020sec/meters"

const client  = mqtt.connect(brokeUrl,options);
console.log("connected flag:  "+ client.connected);
//console.log(client)

client.on("connect",function(){
    console.log("connected:  "+ client.connected);
})

client.on("error", function (error:Error) {
    console.log("Can't connect: " + error);
    process.exit(1)
})

client.on('message',function(topic:string, message:Buffer, packet:any){
    const decodedMessage  = decodePackage(message)
    if (decodedMessage.authenticSample){
        const smartMeterSample = new SmartMeterSample({
            meterId:decodedMessage.meterId,
            authenticSample:decodedMessage.authenticSample,
            date: decodedMessage.date,
            wattsPerHour:decodedMessage.wattsPerHour
        })
        smartMeterSample.save()
    }
});

client.subscribe(topic);

export default client