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
let kafka = require( '../kafka/client' );
auth();

const groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const expenseSchema = require('../models/expenses');
const transactionSchema = require('../models/transaction');
const debtSchema = require('../models/debts');
const getIndexOfGroupBalances = require('./getIndexOfGroupBalances')

router.get('/total_dashboard/:userId', checkAuth, async (req, res) => {

    kafka.make_request('totalDashboard', req.params, function (err, results) {
        console.log('in totalDashboard results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while getting total balance")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while getting total balance")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });

    // const userId = req.params.userId
    // let totalYouOwe = 0
    // let totalYouAreOwed = 0
    // let totalBalance = 0

    // try {
    //     let paidByUserDoc = await transactionSchema.find(
    //         {
    //             $and: [
    //                 { paidByUserId: userId },
    //                 { settleFlag: 'N' },
    //                 { tranType: "6" }
    //             ]

    //         },
    //         {
    //             amount: 1
    //         }
    //     )
    //     for (const doc of paidByUserDoc) {
    //         totalYouOwe += doc.amount
    //     }

    //     let paidForUserDoc = await transactionSchema.find(
    //         {
    //             $and: [
    //                 { paidForUserId: userId },
    //                 { settleFlag: 'N' },
    //                 { tranType: "6" }
    //             ]

    //         },
    //         {
    //             amount: 1
    //         }
    //     )
    //     for (const doc of paidForUserDoc) {
    //         totalYouAreOwed += doc.amount
    //     }

    //     totalBalance = totalYouOwe - totalYouAreOwed

    //     res.status(200).json({
    //         _id: userId,
    //         totalYouOwe: totalYouOwe,
    //         totalYouAreOwed: totalYouAreOwed,
    //         totalBalance: totalBalance
    //     })
    // } catch (error) {
    //     console.log("Error while getting total balance ", error)
    //     res.status(500).send(error)
    // }
});

router.get('/you_are_owed/:userId', checkAuth, async (req, res) => {

    kafka.make_request('dashboardYouAreOwed', req.params, function (err, results) {
        console.log('in dashboardYouAreOwed results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while getting you are owed")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while getting you are owed")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });

    // const userId = req.params.userId
    // let resObj = {}
    // let resArray = []
    // try {
    //     let tranSchemaDoc1 = await transactionSchema.aggregate([
    //         {
    //             $match: {
    //                 $and: [
    //                     { paidByUserId: mongoose.Types.ObjectId(userId) },
    //                     { settleFlag: 'N' },
    //                     { tranType: "6" }
    //                 ]
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: "$paidForUserId",
    //                 total: { $sum: "$amount" }
    //             }
    //         }])

    //     for (const doc of tranSchemaDoc1) {
    //         let userSchemaDoc = await userSchema.findOne(
    //             { _id: doc._id },
    //             {
    //                 userName: 1,
    //                 currency: 1,
    //                 userEmail: 1
    //             }
    //         )
    //         resObj = {}
    //         resObj._id = userSchemaDoc._id
    //         resObj.userEmail = userSchemaDoc.userEmail
    //         resObj.userName = userSchemaDoc.userName
    //         resObj.currency = userSchemaDoc.currency
    //         resObj.totalAmount = doc.total

    //         resArray.push(resObj)
    //     }
    //     res.status(200).send(resArray)
    // } catch (error) {
    //     console.log("Error while getting you are owed", error)
    //     res.status(500).send(error)
    // }
});

router.get('/you_owe/:userId', checkAuth, async (req, res) => {

    kafka.make_request('dashboardYouOwe', req.params, function (err, results) {
        console.log('in dashboardYouOwe results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while getting you owe")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while getting you owe")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });

    // const userId = req.params.userId
    // let resObj = {}
    // let resArray = []
    // try {
    //     let tranSchemaDoc1 = await transactionSchema.aggregate([
    //         {
    //             $match: {
    //                 $and: [
    //                     { paidForUserId: mongoose.Types.ObjectId(userId) },
    //                     { settleFlag: 'N' },
    //                     { tranType: "6" }
    //                 ]
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: "$paidByUserId",
    //                 total: { $sum: "$amount" }
    //             }
    //         }])
    //     for (const doc of tranSchemaDoc1) {
    //         let userSchemaDoc = await userSchema.findOne(
    //             { _id: doc._id },
    //             {
    //                 userName: 1,
    //                 currency: 1,
    //                 userEmail: 1
    //             }
    //         )
    //         resObj = {}
    //         resObj._id = userSchemaDoc._id
    //         resObj.userEmail = userSchemaDoc.userEmail
    //         resObj.userName = userSchemaDoc.userName
    //         resObj.currency = userSchemaDoc.currency
    //         resObj.totalAmount = doc.total

    //         resArray.push(resObj)
    //     }
    //     res.status(200).send(resArray)
    // } catch (error) {
    //     console.log("Error while getting you owe", error)
    //     res.status(500).send(error)
    // }
});

module.exports = router;