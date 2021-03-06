"use strict";
const hexToBinary = require('hex-to-binary');
const hex64 = require('hex64');
module.exports.decodePackage = function (message) {
    const hex = hex64.decode(message.toString());
    const binary = hexToBinary(hex).toString().match(/.{8}/g);
    const realSample = binary[0][0] == 0;
    const id = parseInt(binary[0].substring(1, binary[0].length), 2);
    const wh = parseInt(binary[binary.length - 2] + binary[binary.length - 1], 2);
    const dateTimeVar = new Date(parseInt(binary[1] + binary[2] + binary[3] + binary[4], 2) * 1000);
    return { id: id, realSample: realSample, date: dateTimeVar, wh: wh };
};
//# sourceMappingURL=decoder.js.map