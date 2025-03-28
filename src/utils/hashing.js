const {hash, compare} = require('bcrypt');
const { createHmac } = require("crypto");

exports.doHash = async (data, saltRound) => {
    try {
        return await hash(data, saltRound)
    } catch (error) {
        throw new Error(`Hashing fail: ${error.message}`)
    }
}
exports.doCompare = async (data, hashedData) => {
    try {
        return await compare(data, hashedData)
    } catch (error) {
        throw new Error(`Comparing fail: ${error.message}`)
    }
}

exports.doHmac = (data, key) => {
    if (!data || !key) throw new Error(`data and key are required for HMAC`);
    return createHmac('sha256', key).update(data).digest('hex')
}

exports.compareHmac = (data, key, hmacToCompare) => {
    const generatedHmac = createHmac('sha256', key).update(data).digest('hex');
    return generatedHmac === hmacToCompare;
}