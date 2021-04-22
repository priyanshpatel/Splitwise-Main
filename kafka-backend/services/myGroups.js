const userSchema = require('../models/users');
const groupSchema = require('../models/groups');

function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    let acceptedGroups = []
    userSchema.findOne({ _id: req.params.userId }).then(doc => {
        if (doc != null) {
            acceptedGroups = doc.acceptedGroups

            groupSchema.find(
                { _id: { $in: acceptedGroups } },
                { acceptedUsers: 0, invitedUsers: 0, expenses: 0, transaction: 0, debts: 0, groupBalances: 0 }
            ).then(doc => {
                // res.status(200).send(doc)
                callback( null, doc )
                return;
            }).catch(error => {
                console.log(error);
                // res.status(500).send({ error })
                callback( "No Groups Found" + error, null )
                return;
            })
        } else {
            // res.status(201).send("No groups found")
            callback( "No Groups Found"  + error, null )
        }
    }).catch(error => {
        console.log(error)
        // res.status(500).send({ error })
        callback( "No Groups Found"  + error, null )
        return;
    })
}

exports.handle_request = handle_request;