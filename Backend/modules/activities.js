'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
let { auth, checkAuth } = require('../config/passport')
const mongoose = require('mongoose')
auth();

const groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const expenseSchema = require('../models/expenses');
const transactionSchema = require('../models/transaction');
const debtSchema = require('../models/debts');
const { response } = require('express');
const getIndexOfGroupBalances = require('./getIndexOfGroupBalances')

router.get('/recent_activity/:userId/:groupId/:sortFlag', checkAuth, async (req, res) => {
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
                recentActivityObj.activityDescription = recentActivityObj.paidByUserName + " added " + expense.description + " in " + expense.groupName
                recentActivityObj.expenseDescription = "You owe $ " + expense.eachUserOwes
            }
            recentActivityList.push(recentActivityObj)
        }
        res.status(200).send(recentActivityList)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.post('/settleup', async (req, res) => {
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

        res.status(200).send("Settle up successful")
    } catch (error) {
        console.log("Inisde catch", error)
        res.status(500).send(error)
    }

    // // Change settle flag in transaction
    // let tranSchemaUpd = await transactionSchema.updateMany(
    //     {
    //         $and: [
    //             {
    //                 $or: [
    //                     { paidByUserId: userId1 },
    //                     { paidForUserId: userId1 }
    //                 ]
    //             },
    //             {
    //                 $or: [
    //                     { paidByUserId: userId2 },
    //                     { paidForUserId: userId2 }
    //                 ]
    //             }
    //         ]
    //     },
    //     { $set: { settleFlag: 'Y' } }
    // )
    // console.log("Settled flag successfully changed in transaction schema", tranSchemaUpd)

})

router.get('/settleup/dropdown/:userId', async (req, res) => {
    let debtSchemaDoc = null;
    let debtSchemaDoc1 = null;
    let userSchemaDoc = null;
    const userId = req.params.userId;
    let userIdArr = []
    let dropDownList = [];

    try {
        debtSchemaDoc = await debtSchema.find(
            { userId1: userId },
            { userId2: 1, _id: 0 }
        )
        for (const debt of debtSchemaDoc) {
            userIdArr.push(debt.userId2)
        }

        debtSchemaDoc1 = await debtSchema.find(
            { userId2: userId },
            { userId2: 1, _id: 0 }
        )
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
                "userEmail": user.Email,
                "userNameEmail": user.userName + ' (' + user.userEmail + ')'
            })
        }

        res.status(200).send(dropDownList)
    } catch (error) {
        console.log("Inside error", error)
        res.status(500).send(error)
    }
});

module.exports = router;