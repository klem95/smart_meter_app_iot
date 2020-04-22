const hexToBinary = require('hex-to-binary')
const hex64 = require('hex64')

interface data {
    meterId: number,
    authenticSample: boolean,
    date: Date,
    wattsPerHour: number

}

export const decodePackage = function (message:Buffer) : data {
    const hex = hex64.decode(message.toString())
    const binary = hexToBinary(hex).toString().match(/.{8}/g)

    const authenticSample : boolean = binary[0][0] == 0;
    const meterId : number =  parseInt(binary[0].substring(1,binary[0].length), 2)
    const wattsPerHour : number = parseInt(binary[binary.length-2] + binary[binary.length-1],2)
    const date = new Date(parseInt(binary[1]+binary[2]+binary[3]+binary[4],2) * 1000);

    const sample : data = {
        meterId: meterId,
        authenticSample: authenticSample,
        date: date,
        wattsPerHour: wattsPerHour
    }
    return sample
}