'use strict';
const express = require('express');
const router = express.Router();
var mongoose = require( '../config/db_config' );

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
        console.log( "Signup successful" )
        // callback( null,
        //     response._id )
        res.status( 200 ).send( response )
    } ).catch( error => {
        //console.log( "Error", error )
        // callback( error, null )
        if( error.code == 11000 ) {
            res.status( 400 ).json( {errorMessage: "Email id already exists"} )
        } else {
            res.status( 400 ).json( error )
        }
    } )
} );

module.exports = router