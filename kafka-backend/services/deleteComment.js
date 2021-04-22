const expenseSchema = require('../models/expenses')
const userSchema = require('../models/users');

async function handle_request(msg, callback) {
    let req = {
        body: msg
    }
    try {
        let commentSchemaResObj = {}
        let commentSchemaResArr = []
        let expenseSchemaDoc = await expenseSchema.findOne({ _id: req.body.expenseId }, { comments: 1 })
        if (expenseSchemaDoc != null) {
            let comments = expenseSchemaDoc.comments
            commentSchemaResArr = []
            for (const comment of comments) {
                commentSchemaResObj = {}
                if (comment._id != req.body.commentId) {
                    commentSchemaResObj = comment
                    commentSchemaResArr.push(commentSchemaResObj)
                }
            }
            expenseSchemaDoc.comments = commentSchemaResArr
        }
        let expenseSchemaDocSave = await expenseSchemaDoc.save()
        console.log(expenseSchemaDocSave)

        // res.status(200).send(expenseSchemaDocSave)
        callback( null, expenseSchemaDocSave )
    } catch (error) {
        console.log("Error while deleting comment", error)
        callback( "Error while deleting comment" + error, null )
    }
}

exports.handle_request = handle_request;