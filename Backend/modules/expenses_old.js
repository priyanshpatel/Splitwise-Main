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

router.post('/add', async (req, res) => {
    const userID = req.body.userId;
    const groupID = req.body.groupId;
    const amount = req.body.amount;
    const description = req.body.description;
    const currency = req.body.currency;
    // const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let tran_type = 3;
    let exp_id = null;
    let result_1 = null;
    let api_response = null;
    let settled_flag = 'N';

    let expense = new expenseSchema({
        description: req.body.description,
        amount: req.body.amount,
        groupId: req.body.groupId,
        paidByUserId: req.body.userId,
        currency: req.body.currency
    })

    let transaction = null
    let expId = null
    let groupMembers = []
    let tranType = 3
    let transactionList = []
    let tranIdList = []
    let expenseList = []
    let debtList = []
    // let groupBalances = null

    try {
        let expenseResponse = await expense.save()
        expId = expenseResponse._id
        expenseList.push(expId)

        // Find accpeted users and group balances from groups collection
        let groupSchemaDoc = await groupSchema.findOne({ _id: req.body.groupId })
        groupMembers = groupSchemaDoc.acceptedUsers
        let groupBalances = groupSchemaDoc.groupBalances
        console.log("GroupSchemaDoc", groupSchemaDoc)

        // Insert into transaction collection for each group member
        groupMembers.forEach(async member => {
            let settleFlag = 'N'
            if (member == req.body.userId) {
                tranType = 3
                settleFlag = 'Y'
            } else {
                tranType = 6
            }

            // transaction = new transactionSchema({
            //     groupId: req.body.groupId,
            //     expId: expId,
            //     paidByUserId: req.body.userId,
            //     paidForUserId: member,
            //     tranType: tranType,
            //     amount: (req.body.amount / groupMembers.length).toFixed(2),
            //     settleFlag: settleFlag
            // })

            transaction = {
                groupId: req.body.groupId,
                expId: expId,
                paidByUserId: req.body.userId,
                paidForUserId: member,
                tranType: tranType,
                amount: (req.body.amount / groupMembers.length).toFixed(2),
                settleFlag: settleFlag
            }
            transactionList.push(transaction)

            transactionList.forEach(element => {
                tranIdList.push(element._id)
            })

            let tranInsertRes = await transactionSchema.insertMany(transactionList)
            console.log("Transactions added successfully", tranInsertRes)

            // Update transaction ids in users collection
            for (let i = 0; i < tranInsertRes.length; i++) {

                let tranInsertUserRes = await userSchema.updateOne(
                    { _id: tranInsertRes[i].paidForUserId },
                    { $push: { transaction: tranInsertRes[i]._id } }
                )
                console.log("Transactions successfully added in Users", tranInsertRes)

                // if (!response[i].paidForUserId.equals(response[i].paidByUserId)) {
                //     tranInsertUserRes = await userSchema.updateOne(
                //         { _id: tranInsertRes[i].paidForUserId },
                //         { $push: { transaction: tranInsertRes[i]._id } }
                //     )
                //     console.log("Transactions successfully added for paidForUser", tranInsertUserRes)
                // }
            }

            let updGroupBalance = null
            let groupBalanceIndex = null
            //Update groupBalance for each user in users collection
            groupMembers.forEach(async member => {
                if (member == req.body.userId) {
                    console.log("Index of paidbyuser", getIndexOfGroupBalances(member, groupBalances))
                    groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
                    if (groupBalanceIndex == -1) {
                        updGroupBalance = {
                            balance: (req.body.amount / groupMembers.length).toFixed(2),
                            userId: member
                        }
                        //push newgroupBalance
                        groupSchemaDoc.groupBalances.push(updGroupBalance)
                    } else {
                        updGroupBalance = {
                            balance: parseFloat(groupBalances[groupBalanceIndex].balance) + parseFloat((req.body.amount / groupMembers.length).toFixed(2)),
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
                    // let groupBalancesDoc = await groupSchemaDoc.save()
                    // console.log("Group Balances Successfully updated", groupBalancesDoc)

                    let debtSchemaDoc = await debtSchema.findOne({
                        $and: [
                            {
                                $or: [
                                    { userId1: req.body.userId },
                                    { userId2: req.body.userId }
                                ]
                            },
                            { groupId: req.body.groupId }
                        ]
                    })
                    console.log("debtSchema FindOne", debtSchemaDoc)

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
            })
        })
        //Priyansh
        let expenseSchemaUpdTran = await expenseSchema.updateOne(
            { _id: expId },
            { $push: { transactions: tranIdList } }
        )
        console.log("Transactions successfully added to Expenses", expenseSchemaUpdTran)
        
        groupSchemaDoc.expenses.push(expenseList)
        groupSchemaDoc.transaction.push(tranIdList)

        let groupBalancesDoc = await groupSchemaDoc.save()
        console.log("Group Balances Successfully updated", groupBalancesDoc)

        // let groupSchemaUpdExpTran = await groupSchema.updateOne(
        //     { _id: req.body.groupId },
        //     { $push: { expenses: expenseList, transaction: tranIdList } }
        // )
        // console.log("IDs successfully added to Groups", groupSchemaUpdExpTran)

    } catch (error) {
        res.status('Error while adding expense', error)
    }


    //Old Code
    // expense.save().then(response => {
    //     console.log("expense added successfully", response)
    //     expId = response._id
    //     expenseList.push(response._id)
    //     groupSchema.findOne({ _id: req.body.groupId }, 'acceptedUsers groupBalances').then(doc => {
    //         let groupDoc = doc
    //         groupMembers = doc.acceptedUsers
    //         let groupBalances = doc.groupBalances
    //         console.log("doc", doc)

    //         groupMembers.forEach(member => {
    //             let settleFlag = 'N'
    //             if (member == req.body.userId) {
    //                 tranType = 3
    //                 settleFlag = 'Y'
    //             } else {
    //                 tranType = 6
    //             }

    //             transaction = new transactionSchema({
    //                 groupId: req.body.groupId,
    //                 expId: expId,
    //                 paidByUserId: req.body.userId,
    //                 paidForUserId: member,
    //                 tranType: tranType,
    //                 amount: (req.body.amount / groupMembers.length).toFixed(2),
    //                 settleFlag: settleFlag
    //             })
    //             transactionList.push(transaction)
    //             //
    //             // transaction.save().then(response => {
    //             //     console.log("Transaction Added Successfully", response)
    //             // }).catch(error => {
    //             //     console.log("Error while adding trancations", error)
    //             // })
    //             //
    //         });
    //         transactionList.forEach(element => {
    //             tranIdList.push(element._id)
    //         })
    //         transactionSchema.insertMany(transactionList).then(response => {
    //             // transaction.save().then(response => {
    //             console.log("Transactions Added Successfully", response)

    //             for (let i = 0; i < response.length; i++) {
    //                 userSchema.updateOne(
    //                     { _id: response[i].paidByUserId },
    //                     { $push: { transaction: response[i]._id } }
    //                 ).then(doc => {
    //                     if (!response[i].paidForUserId.equals(response[i].paidByUserId)) {
    //                         userSchema.updateOne(
    //                             { _id: response[i].paidForUserId },
    //                             { $push: { transaction: response[i]._id } }
    //                         ).then(doc => {
    //                             console.log("Transaction successfully added to paidForUser", doc)
    //                         }).catch(error => {
    //                             console.log("Error while adding Transaction to paidForUserId", error)
    //                         })
    //                     }
    //                     console.log("Transaction successfully added to paidByUser", doc)
    //                 }).catch(error => {
    //                     console.log("Error while adding Transaction to paidByUser", error)
    //                 })
    //             }

    //             // userSchema.updateOne(
    //             //     { _id: member },
    //             //     { $push: { debts: debtList } }
    //             // ).then(doc => {
    //             //     console.log("Debts successfully added to Users", doc)
    //             //     console.log("DEBTS", debtList)
    //             // }).catch(error => {
    //             //     console.log("Error while adding Debts to Users", error)
    //             // })




    //             // res.status(200).send(response)
    //             //
    //             // transactionList.forEach(transaction => {
    //             //     if (transaction.paidByUserId.equals(transaction.paidForUserId)){
    //             //         return;
    //             //    } else {

    //             //    }
    //             // })


    //             // for (let i = 0; i < transactionList.length; i++) {
    //             //     userSchema.updateMany(
    //             //         { $or: [{ _id: transaction.paidByUserId }, { _id: transaction.paidForUserId }] },
    //             //         { $push: { transaction: transaction._id } }
    //             //     ).then(response => {
    //             //         console.log("Transaction added in Users for paidByUserId")
    //             //     }).catch(error => {
    //             //         console.log("Error in adding Transaction in Users for paidByUserId")
    //             //     })
    //             // }

    //             //
    //             let updGroupBalance = null
    //             let groupBalanceIndex = null
    //             // let debtList = []

    //             groupMembers.forEach(member => {
    //                 if (member == req.body.userId) {
    //                     console.log("Index of paidbyuser", getIndexOfGroupBalances(member, groupBalances))
    //                     groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
    //                     if (groupBalanceIndex == -1) {
    //                         updGroupBalance = {
    //                             balance: (req.body.amount / groupMembers.length).toFixed(2),
    //                             userId: member
    //                         }
    //                         //save newgroupBalance
    //                         // groupDoc.groupBalances[0] = updGroupBalance
    //                         groupDoc.groupBalances.push(updGroupBalance)
    //                     } else {
    //                         updGroupBalance = {
    //                             balance: parseFloat(groupBalances[groupBalanceIndex].balance) + parseFloat((req.body.amount / groupMembers.length).toFixed(2)),
    //                             userId: member
    //                         }
    //                         groupDoc.groupBalances[groupBalanceIndex] = updGroupBalance
    //                         //Update groupBalance of that particuler user
    //                     }

    //                 } else {
    //                     groupBalanceIndex = getIndexOfGroupBalances(member, groupBalances)
    //                     console.log("Index of paidforuser", getIndexOfGroupBalances(member, groupBalances))
    //                     if (groupBalanceIndex == -1) {
    //                         updGroupBalance = {
    //                             balance: 0 - (req.body.amount / groupMembers.length).toFixed(2),
    //                             userId: member
    //                         }
    //                         //save newgroupBalance
    //                         groupDoc.groupBalances.push(updGroupBalance)
    //                     } else {
    //                         updGroupBalance = {
    //                             balance: groupBalances[groupBalanceIndex].balance - (req.body.amount / groupMembers.length).toFixed(2),
    //                             userId: member
    //                         }
    //                         groupDoc.groupBalances[groupBalanceIndex] = updGroupBalance
    //                         //Update groupBalance of that particuler user
    //                     }
    //                     groupDoc.save().then(response => {
    //                         console.log("Group Balances Successfully updated", response)
    //                     }).catch(error => {
    //                         console.log("Error while updating group balances", error)
    //                     })

    //                     debtSchema.findOne({
    //                         $and: [
    //                             {
    //                                 $or: [
    //                                     { userId1: req.body.userId },
    //                                     { userId2: req.body.userId }
    //                                 ]
    //                             },
    //                             { groupId: req.body.groupId }
    //                         ]
    //                     }).then(response => {
    //                         console.log("debtSchema findOne", response)

    //                         let userId1 = null
    //                         let userId2 = null
    //                         let debtAmount = null
    //                         if (req.body.userId < member) {
    //                             userId1 = req.body.userId
    //                             userId2 = member
    //                             debtAmount = (req.body.amount / groupMembers.length).toFixed(2)

    //                         } else if (req.body.userId > member) {
    //                             userId1 = member
    //                             userId2 = req.body.userId
    //                             debtAmount = 0 - (req.body.amount / groupMembers.length).toFixed(2)
    //                         }

    //                         if (response == null) {
    //                             let debt = new debtSchema({
    //                                 groupId: req.body.groupId,
    //                                 userId1: userId1,
    //                                 userId2: userId2,
    //                                 amount: debtAmount
    //                             })
    //                             debt.save().then(response => {
    //                                 //
    //                                 debtList.push(response._id)
    //                                 userSchema.updateOne(
    //                                     { _id: userId1 },
    //                                     { $push: { debts: response._id } }
    //                                 ).then(doc => {
    //                                     console.log("Debts successfully added to User1", doc)
    //                                     console.log("DEBTS", response._id)

    //                                     userSchema.updateOne(
    //                                         { _id: userId2 },
    //                                         { $push: { debts: response._id } }
    //                                     ).then(doc => {
    //                                         console.log("Debts successfully added to User2", doc)
    //                                         console.log("DEBTS", response._id)

    //                                         groupSchema.updateOne(
    //                                             { _id: req.groupId },
    //                                             { $push: { debts: response._id } }
    //                                         ).then(doc => {
    //                                             console.log("Debts successfully added to Group", doc)
    //                                         }).catch(error => {
    //                                             console.log("Error while adding Debts to Group", error)
    //                                         })

    //                                     }).catch(error => {
    //                                         console.log("Error while adding Debts to User2", error)
    //                                     })


    //                                 }).catch(error => {
    //                                     console.log("Error while adding Debts to User1", error)
    //                                 })
    //                                 //
    //                                 // debtList.push(response._id)
    //                                 console.log("Debt saved successfully", response)
    //                             }).catch(error => {
    //                                 console.log("Error while saving debt", error)
    //                             })
    //                         } else {
    //                             // debtSchema.updateOne({ groupId: req.body.groupId , userId1: userId1, userId2: userId2 },{$inc: {ampunt: debtAmount}}).then(response => {
    //                             debtSchema.updateOne({ groupId: req.body.groupId, userId1: userId1, userId2: userId2 }, { $inc: { amount: debtAmount } }).then(response => {
    //                                 console.log("Debt updated successfully", response)
    //                             }).catch(error => {
    //                                 console.log("Error while updating debts", error)
    //                             })
    //                         }

    //                     }).catch(error => {
    //                         console.log("Error while finding debts", error)
    //                     })
    //                 }

    //                 // userSchema.updateOne(
    //                 //     { _id: member },
    //                 //     { $push: { debts: debtList } }
    //                 // ).then(doc => {
    //                 //     console.log("Debts successfully added to Users", doc)
    //                 //     console.log("DEBTS", debtList)
    //                 // }).catch(error => {
    //                 //     console.log("Error while adding Debts to Users", error)
    //                 // })

    //             })
    //             // Priyansh

    //             // groupSchema.updateOne(
    //             //     { _id: req.body.groupId },
    //             //     { $push: { expenses: expenseList, transactions: tranIdList, debts: debtList } }
    //             // ).then(doc => {
    //             //     console.log("IDs successfully added to Groups", doc)
    //             // }).catch(error => {
    //             //     console.log("Error while adding IDs to Groups", error)
    //             // })

    //             expenseSchema.updateOne(
    //                 { _id: expId },
    //                 { $push: { transactions: tranIdList } }
    //             ).then(doc => {
    //                 //
    //                 groupSchema.updateOne(
    //                     { _id: req.body.groupId },
    //                     { $push: { expenses: expenseList, transaction: tranIdList } }
    //                 ).then(doc => {
    //                     console.log("IDs successfully added to Groups", doc)
    //                 }).catch(error => {
    //                     console.log("Error while adding IDs to Groups", error)
    //                 })
    //                 //
    //                 console.log("Transactions successfully added to Expenses", doc)
    //             }).catch(error => {
    //                 console.log("Error while adding Transactions to Expenses", error)
    //             })

    //         }).catch(error => {
    //             console.log("Error while adding transactions", error)
    //         })

    //     }).catch(error => {
    //         console.log("Error while getting group members", error)
    //     })



    // }).catch(error => {
    //     console.log("Error while adding expense", error)
    //     res.status(500).send(error)
    // })
});
module.exports = router;