const mongoose = require('mongoose')
let Schema = mongoose.Schema;

// let invitedGroupSchema = new Schema({
//     groupId: String
// })

// let acceptedGroupSchema = new Schema({
//     groupId: String
// })

// let debtSchema = new Schema({
//     debtId: String
// })

let userSchema = new Schema({
    userEmail: { type: String, unique: true },
    userName: String,
    userPassword: String,
    timezone: String,
    currency: String,
    language: String,
    profilePicture: String,
    invitedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    acceptedGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
    debts: [
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ],
}
    , { collection: 'users' }
)

module.exports = mongoose.model('userSchema', userSchema)