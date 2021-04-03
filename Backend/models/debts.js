const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let debtSchema = new Schema({
    groupId: String,
    UserId1: String,
    UserId2: String,
    amount: Number
}
    , { collection: 'debts' }
)

module.exports = mongoose.model('debtSchema', debtSchema)