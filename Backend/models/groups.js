const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let acceptedUserSchema = new Schema({
    userId: String
})

let invitedUserSchema = new Schema({
    userId: String
})

let expenseSchema = new Schema({
    expenseId: String
})

let transactionSchema = new Schema({
    tranId: String
})

let debtSchema = new Schema({
    debtId: String
})

let groupsSchema = new Schema({
    groupName: { type: String, unique: true },
    createdBy: String,
    createDate: String,
    groupPicture: String,
    acceptedUsers: [acceptedUserSchema],
    invitedUsers: [invitedUserSchema],
    expenses: [expenseSchema],
    transaction: [transactionSchema],
    debts: [debtSchema]
}
    , { collection: 'groups' }
)

module.exports = mongoose.model('groupsSchema', groupsSchema)