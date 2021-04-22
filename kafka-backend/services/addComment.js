const expenseSchema = require('../models/expenses')
const userSchema = require('../models/users');

async function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    try {
        let expenseSchemaDoc = await expenseSchema.findOne({ _id: req.body.expenseId }, { comments: 1 })
        let userSchemaDoc = await userSchema.findOne({ _id: req.body.AddedByUserId }, { userName: 1 })
        let newComment = {
            description: req.body.description,
            AddedByUserId: req.body.AddedByUserId,
            AddedByUserName: userSchemaDoc.userName,
        }
        expenseSchemaDoc.comments.push(newComment)
        let expenseSchemaDocSave = await expenseSchemaDoc.save()
        console.log(expenseSchemaDocSave)
        // res.status(200).send(expenseSchemaDocSave)
        callback( null, expenseSchemaDocSave )
    } catch (error) {
        console.log("Error while adding comment", error)
        // res.status(500).send(error)
        callback( "Error while adding comment" + error, null )
    }
}

exports.handle_request = handle_request;