const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let transactionSchema = new Schema({
    groupId: String,
    expId: String,
    paidByUserId: String,
    paidForUserId: String,
    tranType: String,
    amount: Number,
    settleFlag: {type: String, default: 'N'},
    settledDate: {type: String, timestamps: true}
}
    , { collection: 'transaction' }
)

module.exports = mongoose.model('transactionSchema', transactionSchema)