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

module.exports = router;