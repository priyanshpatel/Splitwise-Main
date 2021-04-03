const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let transactionSchema = new Schema({
    tranId: String
})

let settledWithUserIdSchema = new Schema({
    userId: String
})

let expenseSchema = new Schema({
    description: String,
    amount: Number,
    groupId: String,
    paidByUserId: String,
    createdAt: {type: String, timestamps: true},
    currency: String,
    settleFlag: {type: String, default: 'N'},
    settledWithUserId: [settledWithUserIdSchema],
    transactions: [transactionSchema]
}
    , { collection: 'expenses' }
)

module.exports = mongoose.model('expenseSchema', expenseSchema)