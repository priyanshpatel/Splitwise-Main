const mongoose = require('mongoose')
let Schema = mongoose.Schema;

// let transactionSchema = new Schema({
//     tranId: String
// })

// let settledWithUserIdSchema = new Schema({
//     userId: String
// })

let commentSchema = new Schema({
    description: String,
    AddedByUserId: mongoose.Schema.Types.ObjectId,
    AddedByUserName: String,
}, {
    timestamps: true,
    versionKey: false
})

let expenseSchema = new Schema({
    description: String,
    amount: Number,
    groupId: String,
    paidByUserId: String,
    currency: String,
    settleFlag: { type: String, default: 'N' },
    settledWithUserId: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    comments: [commentSchema]
}
    , {
        collection: 'expenses',
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('expenseSchema', expenseSchema)