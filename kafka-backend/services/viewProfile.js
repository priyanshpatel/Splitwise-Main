// const express = require('express');
// const router = express.Router();
// const mongoose = require('../config/db_config');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
// let { auth, checkAuth } = require('../config/passport')
let bcrypt = require('bcrypt');
const userSchema = require('../models/users');

async function handle_request(msg, callback) {
    let req = {
        params: msg
    }
    const userId = req.params.userId
    try {
        let userSchemaDoc = await userSchema.findOne(
            { _id: userId },
            { invitedGroups: 0, acceptedGroups: 0, userPassword: 0, debts: 0, transaction: 0 }
        )
        // res.status(200).send(userSchemaDoc)
        callback( null, userSchemaDoc)
    } catch (error) {
        console.log("error while getting user profile", error)
        // res.status(500).send(error)
        callback( "Error while getting user profile " + error, null )
    }
}

exports.handle_request = handle_request;