const Users = require('./model')


exports.getAll = async function() {
    return await Users.getAll()
}

exports.getByMerchId = async function(merch_id) {
    return await Users.getByMerchId(merch_id)
}

exports.getByMerchIdUserId = async function(merch_id, user_id) {
    return await Users.getByMerchIdUserId(merch_id, user_id)
}