const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let transactionSchema = new Schema({
    tranId: String
})

let expenseSchema = new Schema({
    description: String,
    amount: Number,
    groupId: String,
    paidByUserId: String,
    createdAt: {type: String, timestamps: True},
    currency: String,
    settleFlag: {type: String, default: 'N'},
    settledWithUserId: [invitedGroupSchema],
    transactions: [transactionSchema]
}
    , { collection: 'expenses' }
)

module.exports = mongoose.model('expenseSchema', expenseSchema)