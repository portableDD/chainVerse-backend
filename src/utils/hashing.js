const {hash, compare} = require('bcrypt');
const { createHmac } = require("crypto");

exports.doHash =  (data, saltValue) => {
    const result = hash(data, saltValue);
    return result
}
exports.doCompare = (data, hashedData) => {
    const result = compare(data, hashedData);
    return result
}

exports.doHmac = (data, key) => {
    const result = createHmac('sha256', key).update(data).digest('hex');
    return result
}

exports.compareHmac = (data, key, hmacToCompare) => {
    const generatedHmac = createHmac('sha256', key).update(data).digest('hex');
    return generatedHmac === hmacToCompare;
}