"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hexToBinary = require('hex-to-binary');
const hex64 = require('hex64');
exports.decodePackage = function (message) {
    const hex = hex64.decode(message.toString());
    const binary = hexToBinary(hex).toString().match(/.{8}/g);
    const authenticSample = binary[0][0] == 0;
    const meterId = parseInt(binary[0].substring(1, binary[0].length), 2);
    const wattsPerHour = parseInt(binary[binary.length - 2] + binary[binary.length - 1], 2);
    const date = new Date(parseInt(binary[1] + binary[2] + binary[3] + binary[4], 2) * 1000);
    const sample = {
        meterId: meterId,
        authenticSample: authenticSample,
        date: date,
        wattsPerHour: wattsPerHour
    };
    return sample;
};
//# sourceMappingURL=decoder.js.map