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
const Smart_meter_sample_1 = __importDefault(require("../models/Smart-meter-sample"));
const index_1 = require("../index");
const timeConverter_1 = require("./timeConverter");
const sequelize_1 = __importDefault(require("sequelize"));
const User_1 = __importDefault(require("../models/User"));
const tf = require('@tensorflow/tfjs-node');
let result;
let SMA;
let n_items;
let data_raw = [];
let window_size;
let resultdata = [];
exports.train = (dataSet, _n_epochs, _lr_rate, _n_hl, _window_size) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Training model');
    const n_epochs = _n_epochs;
    const lr_rate = _lr_rate;
    const n_hl = _n_hl;
    const size = 80;
    n_items = dataSet.length;
    window_size = _window_size;
    data_raw = yield convertData(yield returnAvg());
    //data_raw = GenerateDataset(n_items);
    SMA = yield computeSMA(data_raw, window_size);
    // console.log(tdata_raw.length)
    // console.log(data_raw.length)
    let inputs = SMA.map(function (inp_f) {
        return inp_f['set'].map(function (val) {
            return val['wattsPerHour'];
        });
    });
    let outputs = SMA.map(function (outp_f) { return outp_f['avg']; });
    let callback = function (epoch, log) {
        const test = index_1.io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
        //console.log(test)
        console.log("Epoch:" + (epoch + 1) + " Loss: " + log.loss);
        console.log(((epoch + 1) * (100 / n_epochs)).toString() + "%");
    };
    result = yield trainModel(inputs, outputs, n_items, window_size, n_epochs, lr_rate, n_hl, callback);
    exports.LSTMmodel = result['model'];
    console.log('Model trained');
});
const computeSMA = (_data, windowSize) => __awaiter(void 0, void 0, void 0, function* () {
    let rAvgs = [];
    let avgPrev = 0;
    const scalar = 1;
    for (let i = 0; i <= _data.length - windowSize; i++) {
        let curr_avg = 0.00, t = i + windowSize;
        for (let k = i; k < t && k <= _data.length; k++)
            curr_avg += (_data[k]['wattsPerHour'] / scalar) / windowSize;
        rAvgs.push({ set: _data.slice(i, i + windowSize), avg: curr_avg });
        avgPrev = curr_avg;
    }
    return rAvgs;
});
const trainModel = (inputs, outputs, size, window_size, n_epochs, learning_rate, n_layers, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const input_layer_shape = window_size;
    const input_layer_neurons = 100;
    const rnn_input_layer_features = 10;
    const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;
    const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps];
    const rnn_output_neurons = 20;
    const rnn_batch_size = window_size;
    const output_layer_shape = rnn_output_neurons;
    const output_layer_neurons = 1;
    const model = tf.sequential();
    inputs = inputs.slice(0, Math.floor(size / 100 * inputs.length));
    outputs = outputs.slice(0, Math.floor(size / 100 * outputs.length));
    const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]).div(tf.scalar(10)); // Tensors store the data (either in input or output format)
    const ys = tf.tensor2d(outputs, [outputs.length, 1]).reshape([outputs.length, 1]).div(tf.scalar(10));
    model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [input_layer_shape] }));
    model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));
    var lstm_cells = [];
    for (let index = 0; index < n_layers; index++) {
        lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
    }
    model.add(tf.layers.rnn({ cell: lstm_cells,
        inputShape: rnn_input_shape, returnSequences: false }));
    model.add(tf.layers.dense({ units: output_layer_neurons, inputShape: [output_layer_shape] }));
    const opt_adam = tf.train.adam(learning_rate);
    model.compile({ optimizer: opt_adam, loss: 'meanSquaredError' });
    const hist = yield model.fit(xs, ys, { batchSize: rnn_batch_size, epochs: n_epochs, callbacks: {
            onEpochEnd: (epoch, log) => __awaiter(void 0, void 0, void 0, function* () { callback(epoch, log); })
        } });
    return { model: model, stats: hist };
});
exports.predictFuture = (dataSet) => __awaiter(void 0, void 0, void 0, function* () {
    data_raw = yield convertData(dataSet);
    //data_raw = GenerateDataset(n_items);
    const _SMA = yield computeSMA(data_raw, window_size);
    let inputs = _SMA.map(function (inp_f) {
        return inp_f['set'].map(function (val) { return val['wattsPerHour']; });
    });
    let inps = inputs.slice(Math.floor(n_items / 100 * inputs.length), inputs.length);
    let known_pred_vals = makePredictions(inps, n_items, result['model']); // a list of prediction from length-n_items to the last sample
    let inpsf = [inputs[inputs.length - 1].slice(0)].slice(0);
    let future_prediction_vals = makePredictions(inpsf, n_items, result['model']);
    let timestamps_a = data_raw.map(function (val) { return val['timestamp']; });
    let timestamps_b = data_raw.map(function (val) {
        return val['timestamp'];
    }).splice(window_size, data_raw.length);
    return { inputs: inputs, inps: inps, known_pred_vals: known_pred_vals };
});
function makePredictions(inputs, size, model) {
    var inps = inputs.slice(Math.floor(size / 100 * inputs.length), inputs.length);
    const outps = model.predict(tf.tensor2d(inps, [inps.length,
        inps[0].length]).div(tf.scalar(10))).mul(10);
    return Array.from(outps.dataSync());
}
const returnAvg = () => __awaiter(void 0, void 0, void 0, function* () {
    const smart0 = yield Smart_meter_sample_1.default.findAll({ where: { meterId: 0 } });
    const smart1 = yield Smart_meter_sample_1.default.findAll({ where: { meterId: 1 } });
    const smart2 = yield Smart_meter_sample_1.default.findAll({ where: { meterId: 2 } });
    const smart3 = yield Smart_meter_sample_1.default.findAll({ where: { meterId: 3 } });
    const { count, rows } = yield User_1.default.findAndCountAll({
        attributes: [
            [sequelize_1.default.fn('DISTINCT', sequelize_1.default.col('meterId')), 'meterId'],
        ],
    });
    console.log(rows);
    for (let i = 0; i > smart0.length; i++) {
        smart0[i].wattsPerHour = (smart0[i].wattsPerHour + smart1[i].wattsPerHour + smart2[i].wattsPerHour + smart3[i].wattsPerHour) / 4;
    }
    return smart0;
});
const convertData = (inputData) => __awaiter(void 0, void 0, void 0, function* () {
    let dataset = [];
    for (let i = 0; i < inputData.length - 1; i++) {
        let convertedTime = yield timeConverter_1.convertTime(inputData[i].date, false);
        dataset.push({ id: inputData[i].id, wattsPerHour: inputData[i].wattsPerHour, timestamp: convertedTime });
    }
    return dataset;
});
function GenerateDataset(size) {
    var dataset = [];
    var dt1 = new Date(), dt2 = new Date();
    dt1.setDate(dt1.getDate() - 1);
    dt2.setDate(dt2.getDate() - size);
    var time_start = dt2.getTime();
    var time_diff = new Date().getTime() - dt1.getTime();
    let curr_time = time_start;
    for (let i = 0; i < size; i++, curr_time += time_diff) {
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
//# sourceMappingURL=LSTM-model.js.map