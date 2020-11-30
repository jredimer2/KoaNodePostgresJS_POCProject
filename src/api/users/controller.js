const Users = require('./model')


exports.getAll = async function() {
    return await Users.getAll()
}

