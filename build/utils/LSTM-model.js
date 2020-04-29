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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs"));
let model;
let resultdata = [];
exports.train = (dataSet) => __awaiter(void 0, void 0, void 0, function* () {
    const n_items = 47;
    const window_size = 6;
    const n_epochs = 150;
    const lr_rate = 0.01;
    const n_hl = 4;
    const size = 50;
    const SMA = yield computeSMA(dataSet, window_size);
    let inputs = SMA.map(function (inp_f) {
        return inp_f['set'].map(function (val) {
            return val['wattsPerHour'];
        });
    });
    let outputs = SMA.map(function (outp_f) { return outp_f['avg']; });
    let callback = function (epoch, log) {
        console.log("Epoch:" + (epoch + 1) + " Loss: " + log.loss);
        console.log(((epoch + 1) * (100 / n_epochs)).toString() + "%");
    };
    resultdata = yield trainModel(inputs, outputs, n_items, window_size, n_epochs, lr_rate, n_hl, callback);
});
const computeSMA = (_data, windowSize) => __awaiter(void 0, void 0, void 0, function* () {
    let rAvgs = [];
    let avgPrev = 0;
    for (let i = 0; i <= _data.length - windowSize; i++) {
        let curr_avg = 0.00, t = i + windowSize;
        for (let k = i; k < t && k <= _data.length; k++)
            curr_avg += _data[k]['wattsPerHour'] / windowSize;
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
    const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]).div(tf.scalar(10));
    const ys = tf.tensor2d(outputs, [outputs.length, 1]).reshape([outputs.length, 1]).div(tf.scalar(10));
});
//# sourceMappingURL=LSTM-model.js.map