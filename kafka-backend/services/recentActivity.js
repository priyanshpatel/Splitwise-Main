const userSchema = require('../models/users');
const expenseSchema = require('../models/expenses');

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    const userId = req.params.userId
    const groupId = req.params.groupId
    const sortFlag = req.params.sortFlag

    let recentActivityObj = {}
    let recentActivityList = []
    let expenseSchemaDoc = null
    let userSchemaDoc = null

    try {

        if (groupId == 0) {
            // All recent activities
            userSchemaDoc = await userSchema.findOne({ _id: userId }, { acceptedGroups: 1 })
            console.log(userSchemaDoc)

            if (sortFlag == 1) {
                //Ascending
                expenseSchemaDoc = await expenseSchema.find(
                    { groupId: { $in: userSchemaDoc.acceptedGroups } }
                )
            } else {
                // Descending
                expenseSchemaDoc = await expenseSchema.find(
                    { groupId: { $in: userSchemaDoc.acceptedGroups } }
                ).sort({ _id: -1 })
            }

        } else {
            // Recent activity of that particular group
            if (sortFlag == 1) {
                //Ascending
                expenseSchemaDoc = await expenseSchema.find(
                    { groupId: groupId }
                )
                console.log(expenseSchemaDoc)
            } else {
                // Descending
                expenseSchemaDoc = await expenseSchema.find(
                    { groupId: groupId }
                ).sort({ _id: -1 })
            }
        }
        for (const expense of expenseSchemaDoc) {
            recentActivityObj = {}
            recentActivityObj.expenseId = expense._id
            recentActivityObj.createdAt = expense.createdAt
            if (expense.paidByUserId == userId) {
                recentActivityObj.activityDescription = "You added " + expense.description + " in " + expense.groupName
                recentActivityObj.expenseDescription = "You get back $ " + expense.paidByUserGetsBack
            } else {
                recentActivityObj.activityDescription = expense.paidByUserName + " added " + expense.description + " in " + expense.groupName
                recentActivityObj.expenseDescription = "You owe $ " + expense.eachUserOwes
            }
            recentActivityList.push(recentActivityObj)
        }
        // res.status(200).send(recentActivityList)
        callback( null, recentActivityList)
    } catch (error) {
        // res.status(500).send(error)
        console.log("Error while getting recent activity", error)
        callback( "Error while getting recent activity " + error, null )
    }
}

exports.handle_request = handle_request;