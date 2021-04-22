const userSchema = require('../models/users');
const groupSchema = require('../models/groups');

function handle_request(msg, callback) {
    let req = {
        body: msg.body,
        file: msg.file
    }
    // const groupMembers = req.body.groupMembers
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // const groupCount = 0;
    // let groupID = null;

    let imagePath = null;
    if (req.file) {
        imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
    }

    console.log("[][][][][][][][]Request Body[][][][][][][][][][][")
    console.log(req.body.acceptedUsers)

    let invitedUsersSplit = req.body.invitedUsers + ''
    console.log("invitedUsersSplit", invitedUsersSplit)

    let group = new groupSchema({
        groupName: req.body.groupName,
        createdBy: req.body.createdBy,
        createDate: ts,
        groupPicture: imagePath,
        acceptedUsers: req.body.acceptedUsers,
        invitedUsers: invitedUsersSplit.split(',')
    })
    console.log("][][][][][][][][]group schema][][][][][][][][][][][][");
    console.log(group)

    group.save().then(response => {
        console.log("group created successfully", response)
        const groupId = response._id
        console.log("-----------------------------------------------------------");

        let invitedUsersArr = invitedUsersSplit.split(',')
        // req.body.invitedUsers.forEach((element) => {
        //     console.log(element)
        //     invitedUsersArr.push(element)
        // })

        // const invitedUsers = () => { return userSchema.find({ _id: { $in: invitedUsersArr } }) };
        userSchema.find({ _id: { $in: invitedUsersArr } })
            .then(response => {
                console.log("============invited users=================");
                console.log(invitedUsersArr);

                response.forEach(function (user) {
                    console.log("=-=-=-=-=-=-=-=-=-=-=-=", user)
                    userSchema.findByIdAndUpdate({ _id: user._id }
                        , { $push: { invitedGroups: groupId } }, { new: true }
                    ).then(doc => {
                        console.log("successfully updated invited group", doc);

                    }).catch(error => {
                        console.log("error", error);
                    })
                })
            })

        // let acceptedUsersArr = []
        // acceptedUsersArr.push(req.body.acceptedUsers)

        userSchema.find({ _id: { $in: req.body.acceptedUsers } })
            .then(response => {
                console.log("============accepted users=================");
                console.log(req.body.acceptedUsers);

                response.forEach(function (user) {
                    userSchema.findByIdAndUpdate({ _id: user._id }
                        , { $push: { acceptedGroups: groupId } }, { new: true }
                    ).then(doc => {
                        console.log("successfully updated accepted group", doc);

                    }).catch(error => {
                        console.log("error", error);
                    })
                })
            })
        // res.status(200).send(response)
        callback( null, response )
    }).catch(error => {
        console.log("Error while creating group", error);
        callback( null, "Group name already exists" )
        // if (error.code == 11000) {
        //     res.status(201).json({ errorMessage: "Group name already exists" })
        // } else {
        //     console.log(error);
        //     res.status(500).json(error)
        // }
    })
}

exports.handle_request = handle_request;