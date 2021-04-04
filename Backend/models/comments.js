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
    expenseId: String,
    AddedByUserId: String,
    createdAt: { type: String, timestamps: true },
}
    , { collection: 'comments' }
)

module.exports = mongoose.model('commentSchema', commentSchema)