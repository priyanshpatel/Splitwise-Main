const userSchema = require('../models/users');

async function handle_request(msg, callback) {
    let req = {
        body: msg.body,
        file: msg.file
    }
    const userId = req.body.userId;
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const phoneNumber = req.body.phoneNumber;
    const currency = req.body.currency;
    const timezone = req.body.timezone;
    const language = req.body.language;

    let imagePath = null;
    try{
    if (req.file) {
        imagePath = req.file.path.substring(req.file.path.indexOf("/") + 1);
    }
    console.log("Inside update profile post");
    
    let userSchemaUpd = await userSchema.updateOne(
        { _id: userId},
        {
            $set: {
                userName: userName,
                userEmail: userEmail,
                phoneNumber: phoneNumber,
                currency: currency,
                timezone: timezone,
                language: language,
                profilePicture: imagePath
            }
        }
    )

    console.log("Profile Updated", userSchemaUpd)
    // res.status(200).send(userSchemaUpd)
    callback( null, userSchemaUpd )
    } catch(error){
        console.log('Email id already registered')
        callback( "Email id already registered", null )

        // console.log("error while updating profile", error)
        // if (error.errno == 1062) {
        //     res.status(201).send('Email ID already exists');
        // } else {
        //     res.status(500).send(error);
        // }
    }
}

exports.handle_request = handle_request;