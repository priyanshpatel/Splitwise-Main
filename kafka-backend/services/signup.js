// const express = require('express');
// const router = express.Router();
// const mongoose = require('../config/db_config');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
// let { auth, checkAuth } = require('../config/passport')
let bcrypt = require('bcrypt');
const userSchema = require('../models/users');

function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    //
    let user = new userSchema( {
        userEmail: req.body.userEmail,
        userName: req.body.userName,
        userPassword: bcrypt.hashSync( req.body.userPassword, 10 ),
        timezone: "",
        currency: "",
        language: "",
        profilePicture: ""
    } )

    user.save().then( response => {
        console.log("response>>>>>>>>", response)
        let payload = {
            _id: response._id,
            userEmail: response.userPassword,
            userName: response.userName
        }
        let token = jwt.sign( payload, secret, {
            expiresIn: 1008000
        } )
        console.log( "Signup successful", token )
        // callback( null,
        //     response._id )
        // res.status( 200 ).send( "Bearer " + token )
        callback( null, "Bearer " + token )
    } ).catch( err => {
        console.log("error>>>>>>", err)
        callback( err, null )
    } )
}

exports.handle_request = handle_request;