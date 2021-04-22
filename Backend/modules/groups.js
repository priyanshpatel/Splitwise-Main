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

// set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/groups/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            "_" +
            Math.floor(Math.random() * 100) +
            "_" +
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

// Middleware to upload images where the image size should be less than 5MB
const uploadGroupImage = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

// router.post('/create', (req, res) => {
router.post('/create', checkAuth, uploadGroupImage.single("groupPicture"), (req, res) => {
    const payload = {
        body: req.body,
        file: req.file
    }
    kafka.make_request('createGroup', payload, function (err, results) {
        console.log('in create group results');

        if (err) {
            console.log("Inside err");
            res.status(201).send('Group name already exists')
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(201).send('Group name already exists')
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });

    // console.log(req.body)
    // const userID = req.body.userID
    // const groupName = req.body.groupName
    // // const groupPicture = req.body.groupPicture
    // const groupMembers = req.body.groupMembers
    // const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // const groupCount = 0;
    // let groupID = null;

    // let imagePath = null;
    // if (req.file) {
    //     imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
    // }

    // console.log("[][][][][][][][]Request Body[][][][][][][][][][][")
    // console.log(req.body.acceptedUsers)

    // let group = new groupSchema({
    //     groupName: req.body.groupName,
    //     createdBy: req.body.createdBy,
    //     createDate: ts,
    //     groupPicture: imagePath,
    //     acceptedUsers: req.body.acceptedUsers,
    //     invitedUsers: req.body.invitedUsers.split(',')
    // })
    // console.log("][][][][][][][][]group schema][][][][][][][][][][][][");
    // console.log(group)

    // group.save().then(response => {
    //     console.log("group created successfully", response)
    //     const groupId = response._id
    //     console.log("-----------------------------------------------------------");

    //     let invitedUsersArr = req.body.invitedUsers.split(',')
    //     // req.body.invitedUsers.forEach((element) => {
    //     //     console.log(element)
    //     //     invitedUsersArr.push(element)
    //     // })

    //     // const invitedUsers = () => { return userSchema.find({ _id: { $in: invitedUsersArr } }) };
    //     userSchema.find({ _id: { $in: invitedUsersArr } })
    //         .then(response => {
    //             console.log("============invited users=================");
    //             console.log(invitedUsersArr);

    //             response.forEach(function (user) {
    //                 console.log("=-=-=-=-=-=-=-=-=-=-=-=", user)
    //                 userSchema.findByIdAndUpdate({ _id: user._id }
    //                     , { $push: { invitedGroups: groupId } }, { new: true }
    //                 ).then(doc => {
    //                     console.log("successfully updated invited group", doc);

    //                 }).catch(error => {
    //                     console.log("error", error);
    //                 })
    //             })
    //         })

    //     let acceptedUsersArr = []
    //     acceptedUsersArr.push(req.body.acceptedUsers)
    //     // let acceptedUsersArr = req.body.acceptedUsers.join()

    //     // req.body.acceptedUsers.forEach((element) => {
    //     //     acceptedUsersArr.push(element)
    //     // })

    //     userSchema.find({ _id: { $in: acceptedUsersArr } })
    //         .then(response => {
    //             console.log("============accepted users=================");
    //             console.log(acceptedUsersArr);

    //             response.forEach(function (user) {
    //                 userSchema.findByIdAndUpdate({ _id: user._id }
    //                     , { $push: { acceptedGroups: groupId } }, { new: true }
    //                 ).then(doc => {
    //                     console.log("successfully updated accepted group", doc);

    //                 }).catch(error => {
    //                     console.log("error", error);
    //                 })
    //             })
    //         })
    //     res.status(200).send(response)
    // }).catch(error => {
    //     //console.log( "Error", error )
    //     // callback( error, null )
    //     if (error.code == 11000) {
    //         res.status(201).json({ errorMessage: "Group name already exists" })
    //     } else {
    //         console.log(error);
    //         res.status(500).json(error)
    //     }
    // })
});

router.post('/update', checkAuth, uploadGroupImage.single("groupPicture"), (req, res) => {

    const payload = {
        body: req.body,
        file: req.file
    }
    kafka.make_request('updateGroup', payload, function (err, results) {
        console.log('in update group results');

        if (err) {
            console.log("Inside err");
            res.status(201).send('Group name already exists')
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(201).send('Group name already exists')
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });

    // let imagePath = null;
    // if (req.file) {
    //     imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
    // }
    // groupSchema.findOneAndUpdate({ _id: req.body.groupId },
    //     {
    //         $set: {
    //             groupName: req.body.groupName,
    //             groupPicture: imagePath
    //         }
    //     }, { new: true }
    // ).then(response => {
    //     console.log("Group successfully updated")
    //     // callback( null, response )
    //     res.status(200).send(response)
    // }).catch(error => {
    //     if( error.code == 11000 ) {
    //         res.status( 201 ).send("Group name already exists")
    //     } else {
    //         console.log("Error in group update", error)
    //         res.status( 500 ).json( error )
    //     }
    // })
});

router.get('/groupdetails/:groupId', checkAuth, async (req, res) => {
    
    kafka.make_request('groupDetails', req.params, function (err, results) {
        console.log('in view group details results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while getting group details")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while getting group details")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });
    
    // const groupId = req.params.groupId;
    // let groupBalancesList = []
    // let groupBalanceObj = {}

    // try {
    //     const doc = await groupSchema.findOne({ _id: req.params.groupId })
    //     console.log(doc)
    //     let docCopy = doc.toObject()
    //     let groupBalanceObj = {}
    //     for (const element of doc.groupBalances) {
    //         groupBalanceObj = {}
    //         groupBalanceObj = element.toObject()

    //         const userDoc = await userSchema.findOne({ _id: element.userId }, { userName: 1 })
    //         groupBalanceObj["userName"] = userDoc.userName
    //         groupBalancesList.push(groupBalanceObj)

    //     }
    //     docCopy.groupBalances = groupBalancesList

    //     res.status(200).send(docCopy)
    // } catch (error) {
    //     console.log("Error while gettting group details", error)
    //     res.status(500).send(error)
    // }
});

router.post('/acceptrejectinvite', checkAuth, (req, res) => {

    kafka.make_request('acceptRejectInvite', req.body, function (err, results) {
        console.log('in view group details results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while accepting/rejecting/leaving group")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while accepting/rejecting/leaving group")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });

    // console.log("======acceptRejectInvite=====", req.body)
    // const groupId = req.body.groupId;
    // const userId = req.body.userId;
    // const flag = req.body.flag; //A: accept invite, R: reject invite
    // // let pendingUsers = [];
    // let pendingUserIndex = null;
    // if (req.body.flag == 'A') {
    //     groupSchema.updateOne({ _id: req.body.groupId, invitedUsers: mongoose.Types.ObjectId(req.body.userId) }, { $pull: { invitedUsers: req.body.userId }, $push: { acceptedUsers: req.body.userId } }).then(doc => {
    //         console.log("Member moved from pending to accepted", doc)

    //         userSchema.updateOne({ _id: req.body.userId, invitedGroups: mongoose.Types.ObjectId(req.body.groupId) }, { $pull: { invitedGroups: req.body.groupId }, $push: { acceptedGroups: req.body.groupId } }).then(doc => {
    //             console.log("Group moved from pending to accepted", doc)
    //             res.status(200).send(doc)
    //         }).catch(error => {
    //             console.log("1111111111Error while moving group from pending to accepted1111111111", error)
    //             res.status(500).send(error)
    //             return;
    //         })

    //     }).catch(error => {

    //         console.log("22222222222Error while moving member from pending to accepted22222222222", error)
    //         res.status(500).send(error)
    //         return;
    //     })

    // } else if (req.body.flag == 'R') {
    //     groupSchema.updateOne({ _id: req.body.groupId, invitedUsers: req.body.userId }, { $pull: { invitedUsers: req.body.userId } }).then(doc => {
    //         console.log("Member moved from pending to accepted", doc)
    //         userSchema.updateOne({ _id: req.body.userId, invitedGroups: req.body.groupId }, { $pull: { invitedGroups: req.body.groupId } }).then(doc => {
    //             console.log("Group moved from pending to accepted", doc)
    //             res.send(200).send(doc)
    //             return;
    //         }).catch(error => {
    //             console.log("Error while moving group from pending to accepted", error)
    //             res.status(500).send(error)
    //             return;
    //         })
    //     }).catch(error => {
    //         console.log("Error while moving user from pending to accepted", error)
    //         res.status(500).send(error)
    //         return;
    //     })
    // } else if (req.body.flag == 'L') {
    //     groupSchema.updateOne({ _id: req.body.groupId, acceptedUsers: req.body.userId }, { $pull: { acceptedUsers: req.body.userId } }).then(doc => {
    //         console.log("Member moved from pending to accepted", doc)
    //         userSchema.updateOne({ _id: req.body.userId, acceptedGroups: req.body.groupId }, { $pull: { acceptedGroups: req.body.groupId } }).then(doc => {
    //             console.log("Group moved from pending to accepted", doc)
    //             res.send(200).send(doc)
    //             return;
    //         }).catch(error => {
    //             console.log("Error while moving group from pending to accepted", error)
    //             res.status(500).send(error)
    //             return;
    //         })
    //     }).catch(error => {
    //         console.log("Error while moving user from pending to accepted", error)
    //         res.status(500).send(error)
    //         return;
    //     })
    // }
})

router.get('/mygroupspending/:userId', checkAuth, (req, res) => {

    kafka.make_request('myGroupsPending', req.params, function (err, results) {
        console.log('in myGroupsPending results');

        if (err) {
            console.log("Inside err");
            res.status(201).send("No pending group invites")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(201).send("No pending group invites")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    })


    // let invitedGroups = []
    // userSchema.findOne({ _id: req.params.userId }).then(doc => {
    //     if (doc != null) {
    //         invitedGroups = doc.invitedGroups
    //         groupSchema.find(
    //             { _id: { $in: invitedGroups } },
    //             { acceptedUsers: 0, invitedUsers: 0, expenses: 0, transaction: 0, debts: 0, groupBalances: 0 }
    //         ).then(doc => {
    //             res.status(200).send(doc)
    //             return;
    //         }).catch(error => {
    //             res.status(500).send(error)
    //             return;
    //         })
    //     } else {
    //         res.status(201).send('No pending group invites')
    //     }
    // }).catch(error => {
    //     res.status(500).send(error)
    //     return;
    // })


});


router.get('/mygroups/:userId', checkAuth, (req, res) => {

    kafka.make_request('myGroups', req.params, function (err, results) {
        console.log('in myGroups results');

        if (err) {
            console.log("Inside err");
            res.status(201).send("No groups found")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(201).send("No groups found")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    })

    // let acceptedGroups = []
    // userSchema.findOne({ _id: req.params.userId }).then(doc => {
    //     if (doc != null) {
    //         acceptedGroups = doc.acceptedGroups

    //         groupSchema.find(
    //             { _id: { $in: acceptedGroups } },
    //             { acceptedUsers: 0, invitedUsers: 0, expenses: 0, transaction: 0, debts: 0, groupBalances: 0 }
    //         ).then(doc => {
    //             res.status(200).send(doc)
    //             return;
    //         }).catch(error => {
    //             console.log(error);
    //             res.status(500).send({ error })
    //             return;
    //         })
    //     } else {
    //         res.status(201).send("No groups found")
    //     }
    // }).catch(error => {
    //     console.log(error)
    //     res.status(500).send({ error })
    //     return;
    // })
});

router.get('/search/users', checkAuth, (req, res) => {
    kafka.make_request('groupUserSearch', req.query, function (err, results) {
        console.log('in groupUserSearch results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while searching users")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while searching users")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    })

    // const userInput = req.query.keyword
    // userSchema.find(
    //     {
    //         $and: [
    //             {
    //                 $or: [{
    //                     userName: { $regex: ".*" + userInput + ".*" }
    //                 },
    //                 { userEmail: { $regex: ".*" + userInput + ".*" } }
    //                 ]
    //             },
    //             {
    //                 _id: { $ne: req.query.userId }
    //             }
    //         ]
    //     },
    //     {
    //         userEmail: 1,
    //         userName: 1
    //     }
    // ).then(doc => { res.status(200).send(doc) }
    // ).catch(error => {
    //     console.log("Error while searching for users", error)
    //     res.status(500).send({ error })
    // })
});

router.get('/search/groups/:userId', checkAuth, async (req, res) => {

    let payload = {
        params: req.params,
        query: req.query
    }

    kafka.make_request('groupSearch', payload, function (err, results) {
        console.log('in groupSearch results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while searching groups")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while searching groups")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    })

    // const userId = req.params.userId
    // const userInput = req.query.keyword
    // try {
    //     let groupSchemaDoc = await groupSchema.find(
    //         {
    //             $and: [
    //                 { acceptedUsers: { $in: userId } },
    //                 { groupName: { $regex: ".*" + userInput + ".*" } }
    //             ]
    //         },
    //         {
    //             groupName: 1
    //         }
    //     )
    //     res.status(200).send(groupSchemaDoc)
    // } catch (error) {
    //     console.log("Error while searching groups", error)
    //     res.status(500).send(error)
    // }
});

router.get('/groupexpenses/:groupId', checkAuth, async (req, res) => {

    kafka.make_request('groupExpenses', req.params, function (err, results) {
        console.log('in groupExpenses results');

        if (err) {
            console.log("Inside err");
            res.status(500).send("Error while getting group expenses")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(500).send("Error while getting group expenses")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }
    })

    // const groupId = req.params.groupId
    // let resArray = []
    // // let resObj = {}
    // try {
    //     let expenseSchemaDoc = await expenseSchema.find(
    //         { groupId: groupId }
    //     ).sort({ _id: -1 })
    //     console.log(expenseSchemaDoc)
    //     for (const doc of expenseSchemaDoc) {
    //         let settledWithUserName = ''
    //         let paidByUserName = await userSchema.findOne(
    //             { _id: doc.paidByUserId },
    //             { userName: 1 }
    //         )
    //         if (doc.settledWithUserId != null && doc.settleFlag == 'Y') {
    //             settledWithUserName = await userSchema.findOne(
    //                 { _id: doc.settledWithUserId[0] },
    //                 { userName: 1 }
    //             )
    //         }
    //         // console.log(paidByUserName)
    //         let resObj = {}
    //         resObj.expenseId = doc._id
    //         resObj.paidByUserId = paidByUserName._id
    //         resObj.paidByUserName = paidByUserName.userName
    //         resObj.description = doc.description
    //         resObj.amount = doc.amount
    //         resObj.currency = doc.currency
    //         resObj.comments = doc.comments
    //         resObj.createdAt = doc.createdAt
    //         resObj.settleFlag = doc.settleFlag
    //         resObj.settledWithUserId = doc.settledWithUserId
    //         resObj.settledWithUserName = settledWithUserName.userName

    //         // resObj.expense = doc
    //         // resObj.expense = doc
    //         resArray.push(resObj)
    //     }

    //     res.status(200).send(resArray)
    // } catch (error) {
    //     console.log("Error while getting group expenses", error)
    //     res.status(500).send(error)
    // }
});

router.post('/leave', checkAuth, async (req, res) => {
    const groupId = req.body.groupId;
    const userId = req.body.userId;
    console.log("=====req====", req.body)
    try {
        let groupSchemaDoc = await groupSchema.findOne(
            {
                _id: groupId
            },
            {
                acceptedUsers: 1,
                groupBalances: 1
            }
        )
        console.log("=====group leave group schema doc======", groupSchemaDoc)
        let groupBalanceIndex = getIndexOfGroupBalances(userId, groupSchemaDoc.groupBalances)
        console.log("groupbalancesindex", groupBalanceIndex)

        if ( groupBalanceIndex!== -1 && groupSchemaDoc.groupBalances[groupBalanceIndex].amount !== 0) {
            res.status(400).send("Please settle up your debts first")
        } else {
            // { $pull: { invitedUsers: req.body.userId }


            res.status(200).send(groupSchemaDoc)
        }

    } catch (error) {
        console.log("Error while leaving group", error)
        res.status(500).send(error)
    }

    // const getDebtQuery = "SELECT IFNULL(SUM(D.AMOUNT),0) AS DEBT_AMOUNT FROM DEBTS D WHERE D.GROUP_ID = " + groupID + " AND (D.USER_ID_1 = " + userID + " OR D.USER_ID_2 = " + userID + ")";
    // const leaveGroupQuery = "UPDATE USER_GROUP_MAP SET INVITE_FLAG = 'L' WHERE GROUP_ID = " + groupID + " AND USER_ID = " + userID
    // con.query(getDebtQuery, function (err, result, fields) {
    //     if (err) {
    //         res.status(500).send(err);
    //         return;
    //     } else {
    //         const debtAmount = result[0].DEBT_AMOUNT;
    //         if (debtAmount != 0) {
    //             res.status(201).send("Please settle up your balance first")
    //         }
    //         else {
    //             con.query(leaveGroupQuery, function (err, result, fields) {
    //                 if (err) {
    //                     console.log(err);
    //                     //res.status(500).send("Error while leaving group");
    //                     return;
    //                 } else {
    //                     res.status(200).send("Left group successfully");
    //                 }
    //             });
    //         }
    //     }
    // });
});


// router.get('/search/groups/:userID', (req, res) => {
//     const userID = req.params.userID
//     const userInput = req.query.keyword
//     // const groupSearchQuery = "SELECT USER_ID, USER_EMAIL, USER_NAME FROM USERS WHERE USER_NAME LIKE '%"+userInput+"%' OR USER_EMAIL LIKE '%"+userInput+"%'";
//     const groupSearchQuery = "SELECT E.GROUP_ID, E.GROUP_NAME FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_NAME LIKE '%" + userInput + "%' AND E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'A' AND U.USER_ID = " + userID;
//     groupSchema.find({ $or: [{ groupName: /.*userInput.*/ }, { userEmail: /.*userInput.*/ }] }).then(doc => {
//         res.status(200).send(doc)
//     }).catch(error => {
//         console.log("Error while searching for users", error)
//         res.status(500).send({ error })
//     })
// });

// router.get('/mygroups/:userID', (req, res) => {
//     //const userID = req.body.userID
//     const userID = req.params.userID
//     const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE INVITE_FLAG = 'A' AND USER_ID = " + userID

//     con.query(groupCountQuery, function (err, result, fields) {
//         if (err) {
//             console.log("Group count error");
//             res.status(500).send("Error");
//             return;
//         } else if (result[0].COUNT < 1) {
//             console.log("User is not part of any group");
//             res.status(201).send("You are not a part of any group");
//             return;
//         } else {
//             const getGroupsQuery = "SELECT E.GROUP_NAME, E.GROUP_ID, U.INVITE_FLAG FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'A' AND U.USER_ID = " + userID
//             con.query(getGroupsQuery, function (err, result, fields) {
//                 if (err) {
//                     console.log("error getting groups");
//                     res.status(500).send("error getting groups");
//                     return;
//                 } else {
//                     res.status(200).send(result);
//                 }
//             });
//         }
//     });

// });

// router.get('/mygroupspending/:userID', (req, res) => {
//     //const userID = req.body.userID
//     const userID = req.params.userID
//     const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE INVITE_FLAG = 'P' AND USER_ID = " + userID
//     //const groupCountQuery = "SELECT COUNT(0) AS COUNT FROM USER_GROUP_MAP WHERE USER_ID = " + userID

//     con.query(groupCountQuery, function (err, result, fields) {
//         if (err) {
//             console.log("Group count error");
//             res.status(500).send("Error");
//             return;
//         } else if (result[0].COUNT < 1) {
//             console.log("User does not have any pending invites");
//             res.status(201).send("You do not have any pending invites");
//             return;
//         } else {
//             const getGroupsQuery = "SELECT E.GROUP_NAME, E.GROUP_ID, U.INVITE_FLAG FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'P' AND U.USER_ID = " + userID
//             con.query(getGroupsQuery, function (err, result, fields) {
//                 if (err) {
//                     console.log("error getting groups");
//                     res.status(500).send("error getting groups");
//                     return;
//                 } else {
//                     res.status(200).send(result);
//                 }
//             });
//         }
//     });

// });

// router.post('/acceptrejectinvite', (req, res) => {
//     const groupID = req.body.groupID;
//     const userID = req.body.userID;
//     const flag = req.body.flag;

//     const acceptRejectQuery = "UPDATE USER_GROUP_MAP U SET U.INVITE_FLAG = '" + flag + "' WHERE U.GROUP_ID = " + groupID + " AND U.USER_ID = " + userID

//     con.query(acceptRejectQuery, function (err, result, fields) {
//         if (err) {
//             console.log("Error updating invite flag");
//             res.status(500).send("Error updating Invite");
//             return;
//         } else {
//             const queryResult = result.affectedRows;
//             res.status(200).json({ "rowsAffected": queryResult });
//         }
//     });

// })

// // router.post('/leave', (req, res) => {
// //     const groupID = req.body.groupID;
// //     const userID = req.body.userID;

// //     const leaveGroupQuery = "DELETE FROM USER_GROUP_MAP WHERE GROUP_ID = " + groupID + " AND USER_ID = " + userID
// //     console.log(leaveGroupQuery);

// //     con.query(leaveGroupQuery, function (err, result, fields) {
// //         if (err) {
// //             console.log("Error while leaving group");
// //             res.status(500).send("Error while leaving group");
// //             return;
// //         } else {
// //             console.log(result);
// //             res.status(200).send(result);
// //         }
// //     });
// // })

// router.get('/groupdetails/:groupID', (req, res) => {
//     const groupID = req.params.groupID;

//     const getGroupDetailsQuery = "SELECT * FROM EXPENSE_GROUPS WHERE GROUP_ID = " + groupID

//     con.query(getGroupDetailsQuery, function (err, result, fields) {
//         if (err) {
//             console.log("Error while getting group details");
//             res.status(500).send("Error while getting group details");
//             return;
//         } else {
//             res.status(200).send(result);
//         }
//     });
// });

// router.post('/update', uploadGroupImage.single("groupPicture"), (req, res) => {
//     const groupID = req.body.groupID;
//     const groupName = req.body.groupName;
//     // const groupPicture = req.body.groupPicture;

//     let imagePath = null;
//     if (req.file) {
//         // console.log(req.file);
//         imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
//     }

//     const updateGroupDetails = "UPDATE EXPENSE_GROUPS SET GROUP_NAME = '" + groupName + "', GROUP_PICTURE = '" + imagePath + "' WHERE GROUP_ID = " + groupID

//     con.query(updateGroupDetails, function (err, result, fields) {
//         if (err) {
//             console.log("Error while updating group details");
//             console.log(err);
//             if (err.code === 'ER_DUP_ENTRY') {
//                 res.status(201).send('Group name already exists');
//             } else {
//                 res.status(500).send(err);
//             }
//         } else {
//             res.status(200).send(result);
//         }
//     });
// });

// router.get('/search/users', (req, res) => {
//     //const userID = req.body.userID;
//     const userInput = req.query.keyword
//     const userSearchQuery = "SELECT USER_ID, USER_EMAIL, USER_NAME FROM USERS WHERE USER_NAME LIKE '%" + userInput + "%' OR USER_EMAIL LIKE '%" + userInput + "%'";
//     // console.log(profileViewQuery);
//     con.query(userSearchQuery, function (err, users, fields) {
//         if (err) {
//             res.status(500).send('Error');
//         } else {
//             res.status(200).json({
//                 // 'userID': result[0].USER_ID,
//                 // 'userEmail': result[0].USER_EMAIL,
//                 // 'userName': result[0].USER_NAME,
//                 users
//             });
//         }
//     });
// });

// router.get('/search/groups/:userID', (req, res) => {
//     const userID = req.params.userID
//     const userInput = req.query.keyword
//     // const groupSearchQuery = "SELECT USER_ID, USER_EMAIL, USER_NAME FROM USERS WHERE USER_NAME LIKE '%"+userInput+"%' OR USER_EMAIL LIKE '%"+userInput+"%'";
//     const groupSearchQuery = "SELECT E.GROUP_ID, E.GROUP_NAME FROM EXPENSE_GROUPS E, USER_GROUP_MAP U WHERE E.GROUP_NAME LIKE '%" + userInput + "%' AND E.GROUP_ID = U.GROUP_ID AND U.INVITE_FLAG = 'A' AND U.USER_ID = " + userID;
//     con.query(groupSearchQuery, function (err, groups, fields) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.status(200).json({
//                 groups
//             });
//         }
//     });
// });

// router.get('/groupbalances/:groupID', (req, res) => {
//     const groupID = req.params.groupID
//     // const groupExpenseQuery = "SELECT UGM.GROUP_ID, UGM.USER_ID , U.USER_NAME, (SELECT SUM(T.AMOUNT) FROM `TRANSACTION` T WHERE T.GROUP_ID = UGM.GROUP_ID AND T.PAID_BY_USER_ID = UGM.USER_ID AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') - (SELECT SUM(T.AMOUNT) FROM `TRANSACTION` T WHERE T.GROUP_ID = UGM.GROUP_ID AND T.PAID_FOR_USER_ID = UGM.USER_ID AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') AS OWE_AMOUNT FROM USER_GROUP_MAP UGM, USERS U WHERE U.USER_ID = UGM.USER_ID AND UGM.GROUP_ID = " + groupID
//     const groupExpenseQuery = "SELECT UGM.GROUP_ID, UGM.USER_ID , U.USER_NAME, (SELECT IFNULL(SUM(T.AMOUNT),0) FROM `TRANSACTION` T WHERE T.GROUP_ID = UGM.GROUP_ID AND T.PAID_BY_USER_ID = UGM.USER_ID AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') - (SELECT IFNULL(SUM(T.AMOUNT),0) FROM `TRANSACTION` T WHERE T.GROUP_ID = UGM.GROUP_ID AND T.PAID_FOR_USER_ID = UGM.USER_ID AND T.TRAN_TYPE = 6 AND T.SETTLED_FLAG = 'N') AS OWE_AMOUNT FROM USER_GROUP_MAP UGM, USERS U WHERE U.USER_ID = UGM.USER_ID AND UGM.GROUP_ID = " + groupID
//     con.query(groupExpenseQuery, function (err, result, fields) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.status(200).send(result);
//         }
//     });
// });

// router.get('/groupexpenses/:groupID', (req, res) => {
//     const groupID = req.params.groupID
//     const groupExpenseQuery = "SELECT E.*, U.USER_NAME, (SELECT S.USER_NAME FROM USERS S WHERE S.USER_ID = E.SETTLED_WITH_USER_ID) AS SETTLED_WITH_USER_NAME FROM EXPENSES E, USERS U WHERE U.USER_ID = E.PAID_BY_USER_ID AND E.GROUP_ID = " + groupID + " ORDER BY EXP_ID DESC"
//     con.query(groupExpenseQuery, function (err, result, fields) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             res.status(200).send(result);
//         }
//     });
// });

// router.post('/leave', (req, res) => {
//     const groupID = req.body.groupID;
//     const userID = req.body.userID;

//     const getDebtQuery = "SELECT IFNULL(SUM(D.AMOUNT),0) AS DEBT_AMOUNT FROM DEBTS D WHERE D.GROUP_ID = " + groupID + " AND (D.USER_ID_1 = " + userID + " OR D.USER_ID_2 = " + userID + ")";
//     const leaveGroupQuery = "UPDATE USER_GROUP_MAP SET INVITE_FLAG = 'L' WHERE GROUP_ID = " + groupID + " AND USER_ID = " + userID
//     con.query(getDebtQuery, function (err, result, fields) {
//         if (err) {
//             res.status(500).send(err);
//             return;
//         } else {
//             const debtAmount = result[0].DEBT_AMOUNT;
//             if (debtAmount != 0) {
//                 res.status(201).send("Please settle up your balance first")
//             }
//             else {
//                 con.query(leaveGroupQuery, function (err, result, fields) {
//                     if (err) {
//                         console.log(err);
//                         //res.status(500).send("Error while leaving group");
//                         return;
//                     } else {
//                         res.status(200).send("Left group successfully");
//                     }
//                 });
//             }
//         }
//     });
// });

module.exports = router;