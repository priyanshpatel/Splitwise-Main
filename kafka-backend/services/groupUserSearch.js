const userSchema = require('../models/users');
const groupSchema = require('../models/groups');

function handle_request(msg, callback) {
    let req = {
        query: msg
    }
    const userInput = req.query.keyword
    userSchema.find(
        {
            $and: [
                {
                    $or: [{
                        userName: { $regex: ".*" + userInput + ".*" }
                    },
                    { userEmail: { $regex: ".*" + userInput + ".*" } }
                    ]
                },
                {
                    _id: { $ne: req.query.userId }
                }
            ]
        },
        {
            userEmail: 1,
            userName: 1
        }
    ).then(doc => { callback( null, doc ) }
    ).catch(error => {
        console.log("Error while searching for users", error)
        // res.status(500).send({ error })
        callback( "Error while searching for users" + error, null )
    })
}

exports.handle_request = handle_request;