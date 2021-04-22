const userSchema = require('../models/users');
const expenseSchema = require('../models/expenses');

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }

    const groupId = req.params.groupId
    let resArray = []
    // let resObj = {}
    try {
        let expenseSchemaDoc = await expenseSchema.find(
            { groupId: groupId }
        ).sort({ _id: -1 })
        console.log(expenseSchemaDoc)
        for (const doc of expenseSchemaDoc) {
            let settledWithUserName = ''
            let paidByUserName = await userSchema.findOne(
                { _id: doc.paidByUserId },
                { userName: 1 }
            )
            if (doc.settledWithUserId != null && doc.settleFlag == 'Y') {
                settledWithUserName = await userSchema.findOne(
                    { _id: doc.settledWithUserId[0] },
                    { userName: 1 }
                )
            }
            // console.log(paidByUserName)
            let resObj = {}
            resObj.expenseId = doc._id
            resObj.paidByUserId = paidByUserName._id
            resObj.paidByUserName = paidByUserName.userName
            resObj.description = doc.description
            resObj.amount = doc.amount
            resObj.currency = doc.currency
            resObj.comments = doc.comments
            resObj.createdAt = doc.createdAt
            resObj.settleFlag = doc.settleFlag
            resObj.settledWithUserId = doc.settledWithUserId
            resObj.settledWithUserName = settledWithUserName.userName

            // resObj.expense = doc
            // resObj.expense = doc
            resArray.push(resObj)
        }

        // res.status(200).send(resArray)
        callback( null, resArray )
    } catch (error) {
        console.log("Error while getting group expenses", error)
        // res.status(500).send(error)
        callback( "Error while getting group expenses" + error, null )
    }
}

exports.handle_request = handle_request;