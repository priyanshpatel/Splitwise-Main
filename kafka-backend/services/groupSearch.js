const groupSchema = require('../models/groups');

async function handle_request(msg, callback) {
    let req = {
        params: msg.params,
        query: msg.query
    }
    const userId = req.params.userId
    const userInput = req.query.keyword
    try {
        let groupSchemaDoc = await groupSchema.find(
            {
                $and: [
                    { acceptedUsers: { $in: userId } },
                    { groupName: { $regex: ".*" + userInput + ".*" } }
                ]
            },
            {
                groupName: 1
            }
        )
        // res.status(200).send(groupSchemaDoc)
        callback( null, groupSchemaDoc )
    } catch (error) {
        console.log("Error while searching groups", error)
        // res.status(500).send(error)
        callback( "Error while searching groups " + error, null )
    }
}

exports.handle_request = handle_request;