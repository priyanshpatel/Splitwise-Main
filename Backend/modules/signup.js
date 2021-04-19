'use strict';
const express = require('express');
const router = express.Router();
var mongoose = require( '../config/db_config' );
const jwt = require('jsonwebtoken');
var {secret} = require('../config/config');
let { auth, checkAuth } = require( '../config/passport' )
auth();

var bcrypt = require( 'bcrypt' );
const userSchema = require( '../models/users' );

router.post('/', ( req, res ) => {
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
        res.status( 200 ).send( "Bearer " + token )
    } ).catch( error => {
        //console.log( "Error", error )
        // callback( error, null )
        if( error.code == 11000 ) {
            res.status( 201 ).json( {errorMessage: "Email id already exists"} )
        } else {
            res.status( 500 ).json( error )
        }
    } )
} );

module.exports = router