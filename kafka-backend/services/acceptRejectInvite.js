const userSchema = require('../models/users');
const groupSchema = require('../models/groups');
const mongoose = require('mongoose');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    const groupId = req.body.groupId;
    const userId = req.body.userId;
    const flag = req.body.flag; //A: accept invite, R: reject invite
    // let pendingUsers = [];
    let pendingUserIndex = null;
    if (req.body.flag == 'A') {
        groupSchema.updateOne({ _id: req.body.groupId, invitedUsers: mongoose.Types.ObjectId(req.body.userId) }, { $pull: { invitedUsers: req.body.userId }, $push: { acceptedUsers: req.body.userId } }).then(doc => {
            console.log("Member moved from pending to accepted", doc)

            userSchema.updateOne({ _id: req.body.userId, invitedGroups: mongoose.Types.ObjectId(req.body.groupId) }, { $pull: { invitedGroups: req.body.groupId }, $push: { acceptedGroups: req.body.groupId } }).then(doc => {
                console.log("Group moved from pending to accepted", doc)
                // res.status(200).send(doc)
                callback( null, doc)
            }).catch(error => {
                console.log("1111111111Error while moving group from pending to accepted1111111111", error)
                // res.status(500).send(error)
                callback( "Error while moving group from pending to accepted", null )
                return;
            })

        }).catch(error => {

            console.log("22222222222Error while moving member from pending to accepted22222222222", error)
            // res.status(500).send(error)
            callback( "Error while moving member from pending to accepted", null )
            return;
        })

    } else if (req.body.flag == 'R') {
        groupSchema.updateOne({ _id: req.body.groupId, invitedUsers: req.body.userId }, { $pull: { invitedUsers: req.body.userId } }).then(doc => {
            console.log("Member moved from pending to accepted", doc)
            userSchema.updateOne({ _id: req.body.userId, invitedGroups: req.body.groupId }, { $pull: { invitedGroups: req.body.groupId } }).then(doc => {
                console.log("Group moved from pending to accepted", doc)
                // res.send(200).send(doc)
                callback( null, doc)
                return;
            }).catch(error => {
                console.log("Error while moving group from pending to accepted", error)
                // res.status(500).send(error)
                callback( "Error while moving member from pending to accepted", null )
                return;
            })
        }).catch(error => {
            console.log("Error while moving user from pending to accepted", error)
            // res.status(500).send(error)
            callback( "Error while moving user from pending to accepted", null )
            return;
        })
    } else if (req.body.flag == 'L') {
        groupSchema.updateOne({ _id: req.body.groupId, acceptedUsers: req.body.userId }, { $pull: { acceptedUsers: req.body.userId } }).then(doc => {
            console.log("Member moved from pending to accepted", doc)
            userSchema.updateOne({ _id: req.body.userId, acceptedGroups: req.body.groupId }, { $pull: { acceptedGroups: req.body.groupId } }).then(doc => {
                console.log("Group moved from pending to accepted", doc)
                // res.send(200).send(doc)
                callback( null, doc)
                return;
            }).catch(error => {
                console.log("Error while moving group from pending to accepted", error)
                // res.status(500).send(error)
                callback( "Error while moving group from pending to accepted", null )
                return;
            })
        }).catch(error => {
            console.log("Error while moving user from pending to accepted", error)
            // res.status(500).send(error)
            callback( "Error while moving user from pending to accepted", null )
            return;
        })
    }
}

exports.handle_request = handle_request;