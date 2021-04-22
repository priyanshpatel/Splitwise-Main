const userSchema = require('../models/users');
const groupSchema = require('../models/groups');

function handle_request(msg, callback) {
    let req = {
        body: msg.body,
        file: msg.file
    }
    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
    }
    groupSchema.findOneAndUpdate({ _id: req.body.groupId },
        {
            $set: {
                groupName: req.body.groupName,
                groupPicture: imagePath
            }
        }, { new: true }
    ).then(response => {
        console.log("Group successfully updated")
        callback( null, response )
        // res.status(200).send(response)
    }).catch(error => {
        // if( error.code == 11000 ) {
        //     res.status( 201 ).send("Group name already exists")
        // } else {
        //     console.log("Error in group update", error)
        //     res.status( 500 ).json( error )
        // }
        console.log("Error while updating group", error)
        callback("Group name already exists", null)
    })
}

exports.handle_request = handle_request;