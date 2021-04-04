const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let transactionSchema = new Schema({
    groupId: mongoose.Schema.Types.ObjectId,
    expId: mongoose.Schema.Types.ObjectId,
    paidByUserId: mongoose.Schema.Types.ObjectId,
    paidForUserId: mongoose.Schema.Types.ObjectId,
    tranType: String,
    amount: {
        type: Number, validate: {
            validator: function (num) {
                return num > 0;
            },
            message: (props) => `${props.value} is not a positive number`,
        },
    },
    settleFlag: { type: String, default: 'N' },
    settledDate: { type: String, timestamps: true }
}
    , {
        collection: 'transaction',
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model('transactionSchema', transactionSchema)