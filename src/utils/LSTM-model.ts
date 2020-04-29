import SmartMeterSample from "../models/Smart-meter-sample";
const tf = require('@tensorflow/tfjs-node')

export let LSTMmodel : any
let result : any
let SMA : any
const n_items = 47
let data_raw : Array<any> = []
let window_size : number

export const train = async (dataSet:SmartMeterSample[], _n_epochs:number,_lr_rate:number,_n_hl:number, _window_size:number) : Promise<void> => {
    console.log('Training model')
    const n_epochs = _n_epochs
    const lr_rate = _lr_rate
    const n_hl = _n_hl
    const size = 50
    window_size = _window_size

    data_raw = await convertData(dataSet)


    SMA = await computeSMA(dataSet,window_size)

    let inputs = SMA.map(function(inp_f:any) {
        return inp_f['set'].map(function(val:any) {
            return val['wattsPerHour'];
        })});



    let outputs = SMA.map(function(outp_f:any) { return outp_f['avg']; });

    let callback = function(epoch:number, log:any) {
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

    const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]).div(tf.scalar(10));
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


export const predictFuture = async () : Promise<object> => {
    let inputs = SMA.map(function(inp_f:any) {
        return inp_f['set'].map(function (val:SmartMeterSample) { return val['wattsPerHour']; }); });

    let outputs = SMA.map(function(outp_f:any) { return outp_f['avg']; });

    let outps = outputs.slice(Math.floor(n_items / 100 * outputs.length), outputs.length);

    let inps = inputs.slice(Math.floor(n_items / 100 * inputs.length), inputs.length);

    let pred_vals = await predict(inps, LSTMmodel);

    let timestamps_a = data_raw.map(function (val:any) { return val['timestamp']; });
    let timestamps_b = data_raw.map(function (val:any) {
        return val['timestamp']; }).splice(window_size, data_raw.length);

    let timestamps_c = data_raw.map(function (val:any) {
        return val['timestamp']; }).splice(window_size + Math.floor(n_items / 100 * outputs.length), data_raw.length);

    let sma = SMA.map(function (val:any) { return val['avg']; });
    let prices = data_raw.map(function (val:any) { return val['price']; });

    let futureValues = [];
    let futureTimeStamps = [];
    let nextDay = [];
    let lastStamp = timestamps_a[timestamps_a.length-1];

    let mydate = new Date(lastStamp);
    let month = mydate.getMonth();
    let day = mydate.getDate();
    let year = mydate.getFullYear();
    let inpsf : any = [inputs[inputs.length -2]];

    let hoursToPredict = 24;

    for(let i = 0; i < hoursToPredict; i++){
        let fValue : any = await predict(inpsf, LSTMmodel);
        fValue = fValue[0]
        futureValues.push(fValue);
        inpsf[0].shift();

        inpsf[0].push(fValue);

        if(i < 10)
            nextDay.push( year +"-"+month + "-"+ day +"T0" +i +":00:00.000Z");
        else
            nextDay.push( year +"-"+month+ "-" + day +"T" + i +":00:00.000Z");
    }

    let average = [];
    for (let i = 0; i < 24; i++){
        let inneravg = 0;
        for(let k = 0; k < ((prices.length)/24); k++){
            inneravg += prices[i+ k*24]
        }
        average.push(inneravg / ((prices.length)/24));
    }

    var averageAll = [];
    let avgSum = 0;

    for(let j = 0; j<prices.length; j++){
        avgSum += prices[j];
    }
    avgSum = avgSum / prices.length;

    for(let y = 0; y <(timestamps_a.length+nextDay.length-1)  ; y++){
        averageAll.push(avgSum);
    }

    let avgsumTimeLabel = [...timestamps_a, ...nextDay];
    return {futureVal: futureValues, avgLabels: avgsumTimeLabel}
}

const predict = async (inps:any,model:any) : Promise <any> => {
    const outps = model.predict(tf.tensor2d(inps, [inps.length,
        inps[0].length]).div(tf.scalar(10))).mul(10);
    return Array.from(outps.dataSync());
}

interface rawDataStruct {
    id: number,
    wattsPerHour: number,
    timestamp: Date
}
const convertData = async (input:SmartMeterSample[]) : Promise <any> =>{
    let dataset : Array<any> = []
    for(let i = 0; i < input.length-1; i++){
        dataset.push({id: input[i].id, wattsPerHour: input[i].wattsPerHour , timestamp: input[i].date })
    }
    return dataset

}
