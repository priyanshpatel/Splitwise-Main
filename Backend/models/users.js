const mongoose = require( 'mongoose' )
var Schema = mongoose.Schema;

var userSchema = new Schema( {
    userEmail: { type: String, unique: true },
    userName: String,
    userPassword: String,
    timezone: String,
    currency: String,
    language: String,
    profilePicture: String,
}
    , { collection: 'users' }
 )

 module.exports = mongoose.model( 'userSchema', userSchema )