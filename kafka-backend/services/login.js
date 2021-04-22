const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
let bcrypt = require('bcrypt');
const userSchema = require('../models/users');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    console.log("logi req>>>>>>>>", req)
    userSchema.findOne({ userEmail: req.body.userEmail }).then(doc => {
        if (bcrypt.compareSync(req.body.userPassword, doc.userPassword)) {
            let payload = {
                _id: doc._id,
                userEmail: doc.userPassword,
                userName: doc.userName
            }

            let token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            })
            console.log("Login Successful", token)
            callback( null, "Bearer " + token )
            // res.status(200).send("Bearer " + token)
        } else {
            console.log("Invalid Credentials")
            // res.status(401).send("Invalid Credentials")
            callback( "Invalid credentials", null )
        }

    }).catch(error => {
        console.log("User Not Found", error)
        // res.status(400).send("User Not found")
        callback( "Error while logging in " + error, null )
    })
}

exports.handle_request = handle_request;