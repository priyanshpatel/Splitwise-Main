'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
let { auth, checkAuth } = require('../config/passport')
const mongoose = require('mongoose')
const multer = require('multer');
auth();

const groupSchema = require('../models/groups');
const userSchema = require('../models/users');
const expenseSchema = require('../models/expenses');
const transactionSchema = require('../models/transaction');
const debtSchema = require('../models/debts');
const { response } = require('express');

// set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/profile/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            "_" +
            Math.floor(Math.random() * 100) +
            "_" +
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

// Middleware to upload images where the image size should be less than 5MB
const uploadGroupImage = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        let userSchemaDoc = await userSchema.findOne(
            { _id: userId },
            { invitedGroups: 0, acceptedGroups: 0, userPassword: 0, debts: 0, transaction: 0 }
        )
        res.status(200).send(userSchemaDoc)
    } catch (error) {
        console.log("error while getting user profile", error)
        res.status(500).send(error)
    }
});

router.post('/update', uploadGroupImage.single("profilePicture"), async (req, res) => {
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
                language: language
            }
        }
    )

    console.log("Profile Updated", userSchemaUpd)
    res.status(200).send(userSchemaUpd)
    } catch(error){
        console.log("error while updating profile", error)
        if (error.errno == 1062) {
            res.status(201).send('Email ID already exists');
        } else {
            res.status(500).send(error);
        }
    }
});

module.exports = router;