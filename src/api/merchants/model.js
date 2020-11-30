const database = require('database')

exports.getAll = async function () {
    return database.query('SELECT * FROM merchants')
}

