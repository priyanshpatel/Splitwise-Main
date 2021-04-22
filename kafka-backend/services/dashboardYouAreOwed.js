const transactionSchema = require('../models/transaction');
const userSchema = require('../models/users');
const mongoose = require('mongoose')

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    const userId = req.params.userId
    let resObj = {}
    let resArray = []
    try {
        let tranSchemaDoc1 = await transactionSchema.aggregate([
            {
                $match: {
                    $and: [
                        { paidByUserId: mongoose.Types.ObjectId(userId) },
                        { settleFlag: 'N' },
                        { tranType: "6" }
                    ]
                }
            },
            {
                $group: {
                    _id: "$paidForUserId",
                    total: { $sum: "$amount" }
                }
            }])

        for (const doc of tranSchemaDoc1) {
            let userSchemaDoc = await userSchema.findOne(
                { _id: doc._id },
                {
                    userName: 1,
                    currency: 1,
                    userEmail: 1
                }
            )
            resObj = {}
            resObj._id = userSchemaDoc._id
            resObj.userEmail = userSchemaDoc.userEmail
            resObj.userName = userSchemaDoc.userName
            resObj.currency = userSchemaDoc.currency
            resObj.totalAmount = doc.total

            resArray.push(resObj)
        }
        // res.status(200).send(resArray)
        callback( null, resArray)
    } catch (error) {
        console.log("Error while getting you are owed", error)
        callback( "Error while getting you are owed " + error, null )
        // res.status(500).send(error)
    }
}

exports.handle_request = handle_request;