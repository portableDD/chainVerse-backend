const {hash, compare} = require('bcrypt');

exports.doHash =  (data, saltValue) => {
    const result = hash(data, saltValue);
    return result
}
// exports.doCompare 