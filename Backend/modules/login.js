'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('../config/db_config');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
let { auth, checkAuth } = require('../config/passport')
let kafka = require( '../kafka/client' );
auth();

let bcrypt = require('bcrypt');
const userSchema = require('../models/users');

// router.post('/', (req, res) => {
//     userSchema.findOne({ userEmail: req.body.userEmail }).then(doc => {
//         if (bcrypt.compareSync(req.body.userPassword, doc.userPassword)) {
//             let payload = {
//                 _id: doc._id,
//                 userEmail: doc.userPassword,
//                 userName: doc.userName
//             }

//             let token = jwt.sign(payload, secret, {
//                 expiresIn: 1008000
//             })
//             console.log("Login Successful", token)
//             // callback( null, "Bearer " + token )
//             // console.log("login successful")
//             // res.status( 200 ).send( doc )
//             res.status(200).send("Bearer " + token)
//         } else {
//             console.log("Invalid Credentials")
//             res.status(401).send("Invalid Credentials")
//             // callback( "Invalid credentials", null )
//         }

//     }).catch(error => {
//         console.log("User Not Found", error)
//         res.status(400).send("User Not found")
//     })
// });

router.post('/', (req, res) => {
    kafka.make_request('login', req.body, function (err, results) {
        console.log('in login results');

        if (err) {
            console.log("Inside err");
            res.status(401).send("Invalid Credentials")
        } else if( err == null && results == null){
            console.log("Inside err");
            res.status(401).send("Invalid Credentials")
        }
        else {
            console.log("Inside else", results);
            res.status(200).send(results)
        }

    });
});

module.exports = router