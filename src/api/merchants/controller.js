const Merchants = require('./model')


exports.getAll = async function() {
    return await Merchants.getAll()
}

