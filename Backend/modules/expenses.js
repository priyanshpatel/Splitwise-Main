'use strict'
const { group } = require('console');
const express = require('express');
const router = express.Router();
// const con = require('./database');
const multer = require('multer');
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

// let transaction = null
// let expId = null
// let groupMembers = []
// let tranType = 3
// let transactionList = []
// let tranIdList = []
// let expenseList = []
// let debtList = []

router.post('/add', async (req, res) => {
    let transaction = null
    let expId = null
    let groupMembers = []
    let tranType = 3
    let transactionList = []
    let tranIdList = []
    let expenseList = []
    let debtList = []

    let expense = new expenseSchema({
        description: req.body.description,
        amount: req.body.amount,
        groupId: req.body.groupId,
        paidByUserId: req.body.userId,
        currency: req.body.currency
    })
    try {
        let expenseResponse = await expense.save()
        console.log("Expense added successfully", expenseResponse)
        expId = expenseResponse._id
        expenseList.push(expId)

        // Find accpeted users and group balances from groups collection
        let groupSchemaDoc = await groupSchema.findOne({ _id: req.body.groupId })
        console.log(groupSchemaDoc)
        groupMembers = groupSchemaDoc.acceptedUsers
        console.log(groupMembers)
        let groupBalances = groupSchemaDoc.groupBalances

        console.log("GroupSchemaDoc", groupSchemaDoc)

        // For each accepted group member
        // await groupMembers.forEach(async member => {
        // for(let i=0; i<groupMembers.length; i++){
        for (const member of groupMembers) {
            let settleFlag = 'N'
            if (member == req.body.userId) {
                tranType = 3
                settleFlag = 'Y'
            } else {
                tranType = 6
            }

            // Create Transactions
            transaction = new transactionSchema({
                groupId: req.body.groupId,
                expId: expId,
                paidByUserId: req.body.userId,
                paidForUserId: member,
                tranType: tranType,
                amount: (req.body.amount / groupMembers.length).toFixed(2),
                settleFlag: settleFlag
            })
            let transactionResponse = await transaction.save()
            console.log("transaction added successfully ", transactionResponse)

            // Create a list of transaction ids
            tranIdList.push(transactionResponse._id)

            // Add transaction ids to user schema for users except paid by user
            if (member != req.body.userId) {
                let userSchemaUpdTran = await userSchema.updateOne(
                    { _id: member },
                    { $push: { transaction: transactionResponse._id } }
                )
                console.log("Transactions added successfully to paidfor user schema")
            }

            // Update debts
            let updGroupBalance = null
            let groupBalanceIndex = null
            if (member == req.body.userId) {
                console.log("Index of paidbyuser", getIndexOfGroupBalances(member, groupBalances))
                groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
                if (groupBalanceIndex == -1) {
                    updGroupBalance = {
                        // balance: (req.body.amount / groupMembers.length).toFixed(2),
                        balance: (req.body.amount - (req.body.amount / groupMembers.length)).toFixed(2),
                        userId: member
                    }
                    //push newgroupBalance
                    groupSchemaDoc.groupBalances.push(updGroupBalance)
                } else {
                    updGroupBalance = {
                        balance: parseFloat(groupBalances[groupBalanceIndex].balance) + parseFloat((req.body.amount - (req.body.amount / groupMembers.length)).toFixed(2)),
                        userId: member
                    }
                    groupSchemaDoc.groupBalances[groupBalanceIndex] = updGroupBalance
                    //Update groupBalance of that particuler user
                }
            } else {
                groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
                console.log("Index of paidforuser", getIndexOfGroupBalances(member, groupBalances))
                if (groupBalanceIndex == -1) {
                    updGroupBalance = {
                        balance: 0 - (req.body.amount / groupMembers.length).toFixed(2),
                        userId: member
                    }
                    //save newgroupBalance
                    groupSchemaDoc.groupBalances.push(updGroupBalance)
                } else {
                    updGroupBalance = {
                        balance: groupBalances[groupBalanceIndex].balance - (req.body.amount / groupMembers.length).toFixed(2),
                        userId: member
                    }
                    groupSchemaDoc.groupBalances[groupBalanceIndex] = updGroupBalance
                    //Update groupBalance of that particuler user
                }
                // let debtSchemaDoc = await debtSchema.findOne({
                //     $and: [
                //         {
                //             $or: [
                //                 { userId1: req.body.userId },
                //                 { userId2: req.body.userId }
                //             ]
                //         },
                //         { groupId: req.body.groupId }
                //     ]
                // })
                // console.log("debtSchema FindOne", debtSchemaDoc)

                let userId1 = null
                let userId2 = null
                let debtAmount = null
                if (req.body.userId < member) {
                    userId1 = req.body.userId
                    userId2 = member
                    debtAmount = (req.body.amount / groupMembers.length).toFixed(2)

                } else if (req.body.userId > member) {
                    userId1 = member
                    userId2 = req.body.userId
                    debtAmount = 0 - (req.body.amount / groupMembers.length).toFixed(2)
                }

                let debtSchemaDoc = await debtSchema.findOne({
                    $and: [
                        {
                            $and: [
                                { userId1: userId1 },
                                { userId2: userId2 }
                            ]
                        },
                        { groupId: req.body.groupId }
                    ]
                })
                console.log("debtSchema FindOne", debtSchemaDoc)

                if (debtSchemaDoc == null) {
                    let debt = new debtSchema({
                        groupId: req.body.groupId,
                        userId1: userId1,
                        userId2: userId2,
                        amount: debtAmount
                    })
                    let debtSaveRes = await debt.save()
                    console.log("Debts saved successfully", debtSaveRes)
                    console.log("DEBTS", debtSaveRes._id)

                    debtList.push(debtSaveRes._id)

                    let userDebtUpdRes = await userSchema.updateOne(
                        { _id: userId1 },
                        { $push: { debts: debtSaveRes._id } }
                    )
                    console.log("Debts successully added to user 1", userDebtUpdRes)

                    userDebtUpdRes = await userSchema.updateOne(
                        { _id: userId2 },
                        { $push: { debts: debtSaveRes._id } }
                    )
                    console.log("Debts successfully added to user 2", userDebtUpdRes)

                    let groupDebtUpdRes = await groupSchema.updateOne(
                        { _id: req.groupId },
                        { $push: { debts: response._id } }
                    )
                    console.log("Debts successfully added to Group", groupDebtUpdRes)
                } else {
                    let debtSchemaUpd = await debtSchema.updateOne({ groupId: req.body.groupId, userId1: userId1, userId2: userId2 }, { $inc: { amount: debtAmount } })
                    console.log("Debt updated successfully", debtSchemaUpd)
                }
            }

        } //)
        console.log("After foreach")
        console.log("tranid list", tranIdList)
        console.log("expense list", expenseList)

        //Save expense id to groups
        groupSchemaDoc.expenses.push(...expenseList)

        //Save transactions to groups
        groupSchemaDoc.transaction.push(...tranIdList)

        // Update groupbalances
        let groupBalancesSave = await groupSchemaDoc.save()
        console.log("Groupbalances, expense, transaction saved successfully", groupBalancesSave)

        let expenseSchemaDoc = await expenseSchema.findOne({ _id: expId })
        expenseSchemaDoc.transactions.push(...tranIdList)
        let expenseSchemaSave = await expenseSchemaDoc.save()
        console.log("Transactions successfully added to expense", expenseSchemaSave)

        // Add transaction ids to user schema for paid by user
        let userSchemaUpdTran = await userSchema.updateOne(
            { _id: req.body.userId },
            { $push: { transaction: tranIdList } }
        )
        console.log("Transactions added successfully to paidBy user schema")
        res.status(200).json({
            expId: expId
        })

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;