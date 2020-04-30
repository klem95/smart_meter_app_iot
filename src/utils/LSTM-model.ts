
import SmartMeterSample from "../models/Smart-meter-sample";
import {io} from '../index'
import {convertTime} from "./timeConverter";
import sequelize from "sequelize";
import User from "../models/User";

const tf = require('@tensorflow/tfjs-node')

export let LSTMmodel : any
let result : any
let SMA : any
let n_items : number
let data_raw : Array<any> = []
let window_size : number
let resultdata : any = [];


export const train = async (dataSet:SmartMeterSample[], _n_epochs:number,_lr_rate:number,_n_hl:number, _window_size:number) : Promise<void> => {
    console.log('Training model')
    const n_epochs = _n_epochs
    const lr_rate = _lr_rate
    const n_hl = _n_hl
    const size = 80




    n_items = dataSet.length
    window_size = _window_size

     data_raw = await convertData(await returnAvg())
    //data_raw = GenerateDataset(n_items);
    SMA = await computeSMA(data_raw,window_size)

   // console.log(tdata_raw.length)
   // console.log(data_raw.length)

    let inputs = SMA.map(function(inp_f:any) {
        return inp_f['set'].map(function(val:any) {
            return val['wattsPerHour'];
        })});

    let outputs = SMA.map(function(outp_f:any) { return outp_f['avg']; });

    let callback = function(epoch:number, log:any) {
        const test = io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
        //console.log(test)
        console.log("Epoch:"+ (epoch + 1) + " Loss: " + log.loss);
        console.log(((epoch + 1) * (100 / n_epochs)).toString() + "%");
    }

    result = await trainModel(inputs, outputs,
        n_items, window_size, n_epochs, lr_rate, n_hl, callback);

    LSTMmodel = result['model'];
    console.log('Model trained')
}


const computeSMA = async (_data:SmartMeterSample[], windowSize:number):Promise<object[]> => {
    let rAvgs : Object [] = []
    let avgPrev = 0
    const scalar = 1

    for (let i = 0; i <= _data.length - windowSize; i++) {
        let curr_avg = 0.00, t = i + windowSize
        for (let k = i; k < t && k <= _data.length; k++)
            curr_avg += (_data[k]['wattsPerHour']/scalar) / windowSize;
        rAvgs.push({ set: _data.slice(i, i + windowSize), avg: curr_avg })
        avgPrev = curr_avg;
    }
    return rAvgs;
}

const trainModel = async (inputs:any, outputs:any, size:number, window_size:number, n_epochs:number, learning_rate:number, n_layers:number, callback:any) : Promise<any> => {
    const input_layer_shape  = window_size;
    const input_layer_neurons = 100;

    const rnn_input_layer_features = 10;
    const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

    const rnn_input_shape  = [ rnn_input_layer_features, rnn_input_layer_timesteps ];
    const rnn_output_neurons = 20;

    const rnn_batch_size = window_size;

    const output_layer_shape = rnn_output_neurons;
    const output_layer_neurons = 1;



    const model = tf.sequential();

    inputs = inputs.slice(0, Math.floor(size / 100 * inputs.length));
    outputs = outputs.slice(0, Math.floor(size / 100 * outputs.length));

    const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]).div(tf.scalar(10)); // Tensors store the data (either in input or output format)
    const ys = tf.tensor2d(outputs, [outputs.length, 1]).reshape([outputs.length, 1]).div(tf.scalar(10));

    model.add(tf.layers.dense({units: input_layer_neurons, inputShape: [input_layer_shape]}));
    model.add(tf.layers.reshape({targetShape: rnn_input_shape}));

    var lstm_cells = [];
    for (let index = 0; index < n_layers; index++) {
        lstm_cells.push(tf.layers.lstmCell({units: rnn_output_neurons}));
    }

    model.add(tf.layers.rnn({cell: lstm_cells,
        inputShape: rnn_input_shape, returnSequences: false}));

    model.add(tf.layers.dense({units: output_layer_neurons, inputShape: [output_layer_shape]}));

    const opt_adam = tf.train.adam(learning_rate);
    model.compile({ optimizer: opt_adam, loss: 'meanSquaredError'});

    const hist = await model.fit(xs, ys,
        { batchSize: rnn_batch_size, epochs: n_epochs, callbacks: {
                onEpochEnd: async (epoch:number, log:any) => { callback(epoch, log); }}});

    return { model: model, stats: hist };
}


export const predictFuture = async (dataSet:SmartMeterSample[]) : Promise<any> => {
     data_raw = await convertData(dataSet)
    //data_raw = GenerateDataset(n_items);
    const _SMA = await computeSMA(data_raw,window_size)

    let inputs = _SMA.map(function(inp_f:any) {
        return inp_f['set'].map(function (val:any) { return val['wattsPerHour']; }); });

    let inps = inputs.slice(Math.floor(n_items / 100 * inputs.length), inputs.length);
    let known_pred_vals = makePredictions(inps, n_items, result['model']); // a list of prediction from length-n_items to the last sample


    let inpsf = [inputs[inputs.length -1].slice(0)].slice(0);
    let future_prediction_vals = makePredictions(inpsf, n_items,  result['model']);

    let timestamps_a = data_raw.map(function (val:any) { return val['timestamp']; });
    let timestamps_b = data_raw.map(function (val:any) {
        return val['timestamp']; }).splice(window_size, data_raw.length);


    return {inputs: inputs, inps:inps, known_pred_vals:known_pred_vals}

}

function makePredictions(inputs:any, size:number, model:any)
{
    var inps = inputs.slice(Math.floor(size / 100 * inputs.length), inputs.length);
    const outps = model.predict(tf.tensor2d(inps, [inps.length,
        inps[0].length]).div(tf.scalar(10))).mul(10);

    return Array.from(outps.dataSync());
}

const returnAvg = async () : Promise <SmartMeterSample[]> =>{
    const users = await User.findAll()
    let avgWt  = await SmartMeterSample.findAll({where:{meterId: users[0].meterId}})
    console.log("user" + users.length)
    console.log("avgWt" + avgWt.length)
    for (let i = 1; i > users.length; i++){
        let sample = await SmartMeterSample.findAll({where:{meterId: users[i].meterId}})
        console.log("sample" + sample.length)
        for (let j = 0; j > sample.length; j++){
            avgWt[j].wattsPerHour += sample[j].wattsPerHour
        }

    }


    for (let i = 0; i > avgWt.length; i++){
        avgWt[i].wattsPerHour = avgWt[i].wattsPerHour /users.length
    }

    return avgWt
}

const convertData = async (inputData:SmartMeterSample[]) : Promise <any> =>{

    let dataset : Array<any> = []
    for(let i = 0; i < inputData.length-1; i++){

        let convertedTime = await convertTime(inputData[i].date, false)
        dataset.push({id: inputData[i].id, wattsPerHour: inputData[i].wattsPerHour, timestamp: convertedTime})
    }
    return dataset

}


function GenerateDataset(size:any)
{
    var dataset = [];
    var dt1 = new Date(), dt2 = new Date();

    dt1.setDate(dt1.getDate() - 1);
    dt2.setDate(dt2.getDate() - size);

    var time_start = dt2.getTime();
    var time_diff = new Date().getTime() - dt1.getTime();

    let curr_time = time_start;
    for (let i = 0; i < size; i++, curr_time+=time_diff) {
        var curr_dt = new Date(curr_time);
        var hours = Math.floor(Math.random() * 100 % 24);
        var minutes = Math.floor(Math.random() * 100 % 60);
        var seconds = Math.floor(Math.random() * 100 % 60);
        dataset.push({ id: i + 1, wattsPerHour: (Math.floor(Math.random() * 10) + 5) + Math.random(),
            timestamp: curr_dt.getFullYear() + "-" + ((curr_dt.getMonth() > 9) ? curr_dt.getMonth() : ("0" + curr_dt.getMonth())) + "-" +
                ((curr_dt.getDate() > 9) ? curr_dt.getDate() : ("0" + curr_dt.getDate())) + " [" + ((hours > 9) ? hours : ("0" + hours)) +
                ":" + ((minutes > 9) ? minutes : ("0" + minutes)) + ":" + ((seconds > 9) ? seconds : ("0" + seconds)) + "]" });
    }

    return dataset;
}