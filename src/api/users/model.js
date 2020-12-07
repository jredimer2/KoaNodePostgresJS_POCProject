const database = require('database')

exports.getByMerchId = async function (merch_id) {
    // there's no user_id field in the users table, hence updated it to id
    console.log(">>>>> MODEL merch_id = ", merch_id)
    return database.query(`SELECT firstname, lastname, email, id, merchant_id
    FROM users WHERE merchant_id=$1`, [merch_id])
}

exports.getByMerchIdUserId = async function (merch_id, user_id) {
    return database.query(`SELECT firstname, lastname, email, user_id, merchant_id
    FROM users WHERE merchant_id=$1 AND user_id=$2`, [merch_id, user_id])
}