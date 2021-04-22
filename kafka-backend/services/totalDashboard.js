const transactionSchema = require('../models/transaction');

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    const userId = req.params.userId
    let totalYouOwe = 0
    let totalYouAreOwed = 0
    let totalBalance = 0

    try {
        let paidByUserDoc = await transactionSchema.find(
            {
                $and: [
                    { paidByUserId: userId },
                    { settleFlag: 'N' },
                    { tranType: "6" }
                ]

            },
            {
                amount: 1
            }
        )
        for (const doc of paidByUserDoc) {
            totalYouOwe += doc.amount
        }

        let paidForUserDoc = await transactionSchema.find(
            {
                $and: [
                    { paidForUserId: userId },
                    { settleFlag: 'N' },
                    { tranType: "6" }
                ]

            },
            {
                amount: 1
            }
        )
        for (const doc of paidForUserDoc) {
            totalYouAreOwed += doc.amount
        }

        totalBalance = totalYouOwe - totalYouAreOwed
        callback( null, {
            _id: userId,
            totalYouOwe: totalYouOwe,
            totalYouAreOwed: totalYouAreOwed,
            totalBalance: totalBalance
        })
        // res.status(200).json({
        //     _id: userId,
        //     totalYouOwe: totalYouOwe,
        //     totalYouAreOwed: totalYouAreOwed,
        //     totalBalance: totalBalance
        // })
    } catch (error) {
        console.log("Error while getting total balance ", error)
        callback( "Error while getting total balance " + error, null )
        // res.status(500).send(error)
    }
}

exports.handle_request = handle_request;