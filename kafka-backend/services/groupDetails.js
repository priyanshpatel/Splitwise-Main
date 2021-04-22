const userSchema = require('../models/users');
const groupSchema = require('../models/groups');

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    const groupId = req.params.groupId;
    let groupBalancesList = []
    let groupBalanceObj = {}
    try {
        const doc = await groupSchema.findOne({ _id: req.params.groupId })
        console.log(doc)
        let docCopy = doc.toObject()
        let groupBalanceObj = {}
        for (const element of doc.groupBalances) {
            groupBalanceObj = {}
            groupBalanceObj = element.toObject()

            const userDoc = await userSchema.findOne({ _id: element.userId }, { userName: 1 })
            groupBalanceObj["userName"] = userDoc.userName
            groupBalancesList.push(groupBalanceObj)

        }
        docCopy.groupBalances = groupBalancesList
        callback( null, docCopy)
        // res.status(200).send(docCopy)
    } catch (error) {
        console.log("Error while gettting group details", error)
        // res.status(500).send(error)
        callback( "Error while getting group details", null )
    }
}

exports.handle_request = handle_request;