const userSchema = require('../models/users');
const groupSchema = require('../models/groups');

function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    let invitedGroups = []
    userSchema.findOne({ _id: req.params.userId }).then(doc => {
        if (doc != null) {
            invitedGroups = doc.invitedGroups
            groupSchema.find(
                { _id: { $in: invitedGroups } },
                { acceptedUsers: 0, invitedUsers: 0, expenses: 0, transaction: 0, debts: 0, groupBalances: 0 }
            ).then(doc => {
                // res.status(200).send(doc)
                callback( null, doc )
                return;
            }).catch(error => {
                // res.status(500).send(error)
                callback( "No pending group invites", null )
                return;
            })
        } else {
            // res.status(201).send('No pending group invites')
            callback( "No pending group invites", null )
        }
    }).catch(error => {
        // res.status(500).send(error)
        callback( "No pending group invites", null )
        return;
    })
}

exports.handle_request = handle_request;