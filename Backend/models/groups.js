const mongoose = require('mongoose')
let Schema = mongoose.Schema;

// let acceptedUserSchema = new Schema({
//     userId: String
// })

// let invitedUserSchema = new Schema({
//     userId: String
// })

// let expenseSchema = new Schema({
//     expenseId: String
// })

// let transactionSchema = new Schema({
//     tranId: String
// })

// let debtSchema = new Schema({
//     debtId: String
// })

let groupBalanceSchema = new Schema({
    balance: {type: Number},
    userId: Schema.Types.ObjectId,
},{
    timestamps: true,
    versionKey: false
})

let groupsSchema = new Schema({
    groupName: { type: String, unique: true },
    createdBy: String,
    createDate: String,
    groupPicture: String,
    acceptedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    invitedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    transaction: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    debts: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    groupBalances: [groupBalanceSchema]
}
    , { collection: 'groups' }
)

module.exports = mongoose.model('groupsSchema', groupsSchema)