const userSchema = require('../models/users');
const debtSchema = require('../models/debts');
const mongoose = require('mongoose')

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    let debtSchemaDoc = null;
    let debtSchemaDoc1 = null;
    let userSchemaDoc = null;
    const userId = req.params.userId;
    let userIdArr = []
    let dropDownList = [];
    console.log("userId>>>>>>>>>>>>", userId)
    try {

        // $and: [
        //     { userId1: userId1 },
        //     { userId2: userId2 }
        // ]
        // _id: { $ne: req.query.userId }

        debtSchemaDoc = await debtSchema.find(
            {
                $and: [
                    { userId1: userId },
                    { amount: { $ne: 0 } }
                ]
            }
        )
        console.log("debtSchemaDoc>>>>>>>>>>", debtSchemaDoc)
        for (const debt of debtSchemaDoc) {
            userIdArr.push(debt.userId2)
        }

        debtSchemaDoc1 = await debtSchema.find(
            {
                $and: [
                    { userId2: userId },
                    { amount: { $ne: 0 } }
                ]
            }
        )
        console.log("debtSchemaDoc1>>>>>>>>>>", debtSchemaDoc)
        for (const debt of debtSchemaDoc1) {
            userIdArr.push(debt.userId1)
        }

        userSchemaDoc = await userSchema.find(
            { _id: { $in: userIdArr } },
            { userName: 1, userEmail: 1, _id: 1 }
        )
        for (const user of userSchemaDoc) {
            dropDownList.push({
                "_id": user._id,
                "userName": user.userName,
                "userEmail": user.userEmail,
                "userNameEmail": user.userName + ' (' + user.userEmail + ')'
            })
        }

        // res.status(200).send(dropDownList)
        callback( null, dropDownList)
    } catch (error) {
        console.log("Error while getting settle up dropdown", error)
        callback( "Error while getting settle up dropdown "+ error, null )
        // res.status(500).send(error)
    }
}

exports.handle_request = handle_request;