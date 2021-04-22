const groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const expenseSchema = require('../models/expenses');
const transactionSchema = require('../models/transaction');
const debtSchema = require('../models/debts');
const mongoose = require('mongoose')
const getIndexOfGroupBalances = require('./getIndexOfGroupBalances')

async function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    let userId1 = req.body.userId1
    let userId2 = req.body.userId2
    let userId = req.body.userID
    let swap = null
    let groupSchemaDoc = null

    if (userId2 < userId1) {
        swap = userId1
        userId1 = userId2
        userId2 = swap
    }
    try {
        // Get debts
        let debtSchemaDoc = await debtSchema.find({
            $and: [
                { userId1: userId1 },
                { userId2: userId2 }
            ]
        })
        console.log("debtSchema find", debtSchemaDoc)

        // Update groupBalances pertaining to every debt
        for (const debt of debtSchemaDoc) {
            groupSchemaDoc = await groupSchema.findOne(
                { _id: debt.groupId }
            )
            const groupBalanceIndexUser1 = getIndexOfGroupBalances(userId1, groupSchemaDoc.groupBalances)
            const groupBalanceIndexUser2 = getIndexOfGroupBalances(userId2, groupSchemaDoc.groupBalances)

            if (debt.amount < 0) {
                groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance + Math.abs(debt.amount)
                groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance - Math.abs(debt.amount)
            } else {
                groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser1].balance - Math.abs(debt.amount)
                groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance = groupSchemaDoc.groupBalances[groupBalanceIndexUser2].balance + Math.abs(debt.amount)
            }
            console.log("updated groupBalances", groupSchemaDoc.groupBalances)

            // Insert into expenses
            let expense = new expenseSchema({
                description: 'settle up',
                amount: Math.abs(debt.amount),
                groupId: debt.groupId,
                paidByUserId: (debt.amount < 0) ? userId1 : userId2,
                currency: '$',
                settleFlag: 'Y',
                transactions: [],
                settledWithUserId: [(debt.amount < 0) ? userId2 : userId1]
            })
            let expenseResponse = await expense.save()
            console.log("expense added successfully ", expenseResponse)

            //Insert into transaction
            let transaction = new transactionSchema({
                groupId: debt.groupId,
                expId: expenseResponse._id,
                paidByUserId: (debt.amount < 0) ? userId1 : userId2,
                paidForUserId: (debt.amount < 0) ? userId2 : userId1,
                tranType: 0,
                amount: Math.abs(debt.amount),
                settleFlag: 'Y'
            })
            let transactionResponse = await transaction.save()
            console.log("transaction added successfully ", transactionResponse)

            // Add transaction id to expenses
            expenseResponse.transactions.push(transactionResponse._id)
            let expenseSave = await expense.save()
            console.log("transaction id successfully added to expense", expenseSave)

            debt.amount = 0
            let debtSave = await debt.save()
            console.log("debt amount updated", debtSave)
        }

        // Change settle flag in transaction
        let tranSchemaUpd = await transactionSchema.updateMany(
            {
                $and: [
                    {
                        $or: [
                            { paidByUserId: userId1 },
                            { paidForUserId: userId1 }
                        ]
                    },
                    {
                        $or: [
                            { paidByUserId: userId2 },
                            { paidForUserId: userId2 }
                        ]
                    }
                ]
            },
            { $set: { settleFlag: 'Y' } }
        )
        console.log("Settled flag successfully changed in transaction schema", tranSchemaUpd)

        let groupSchemaUpd = await groupSchemaDoc.save()
        console.log("Group Balances updated successfully", groupSchemaUpd)

        // res.status(200).send("Settle up successful")
        callback( null, "Settle up successful")
    } catch (error) {
        console.log("Error while settling up", error)
        callback( "Error while settling up "+ error, null )
        // res.status(500).send(error)
    }
}

exports.handle_request = handle_request;