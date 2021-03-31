var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var mongoose = require( './config/db_config' );
var { frontend_url } = require( './config/config' )
var path = require( 'path' )
var app = express();
var session = require( "express-session" );
var cookieParser = require( "cookie-parser" );
var cors = require( 'cors' );

const PORT = 3001;

//Session management

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( 'public' ) )
app.use( cors( { origin: frontend_url, credentials: true } ) );
app.use(
    session( {
        key: 'user_id',
        secret: "CMPE_273_Lab_2",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000
        }
    } )
);

app.use(express.static("public"));

app.listen( PORT, () => {
    console.log( "Server listening on port: ", PORT );
} );