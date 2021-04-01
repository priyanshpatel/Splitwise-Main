'use strict';
const express = require('express');
const router = express.Router();
var mongoose = require( '../config/db_config' );

var bcrypt = require( 'bcrypt' );
const userSchema = require( '../models/users' );

router.post('/', (req, res) => {
    var userEmail = req.body.userEmail;
    var userPassword = req.body.userPassword;
    console.log(req.body.userEmail)
    console.log(req.body.userPassword)
    userSchema.findOne( { userEmail: req.body.userEmail } ).then( doc => {
        if ( bcrypt.compareSync( req.body.userPassword, doc.userPassword ) ) {
            // let payload = {
            //     _id: doc._id,
            //     email: doc.userPassword,
            //     name: doc.userName
            // }

            // let token = jwt.sign( payload, secret, {
            //     expiresIn: 1008000
            // } )
            // console.log( "Login Successfull", token )
            // callback( null, "Bearer " + token )
            console.log("login successful")
            res.status( 200 ).send( doc )
        } else {
            console.log( "Invalid Credentials" )
            res.status( 401 ).send( "Invalid Credentials" )
            // callback( "Invalid credentials", null )
        }

    } ).catch( error => {
        console.log( "User Not Found", error )
        res.status( 400 ).send( "User Not found" )
    } )
});

module.exports = router