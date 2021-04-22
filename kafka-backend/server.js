let connection = new require( './kafka/Connection' );
let mongoose = require( './config/db_config' );

let login = require( './services/login' );
let signup = require('./services/signup');
let viewProfile = require('./services/viewProfile');
let updateProfile = require('./services/updateProfile');
let createGroup = require('./services/createGroup');
let updateGroup = require('./services/updateGroup');
let groupDetails = require('./services/groupDetails');
let acceptRejectInvite = require('./services/acceptRejectInvite');
let myGroupsPending = require('./services/myGroupsPending');
let myGroups = require('./services/myGroups');
let groupUserSearch = require('./services/groupUserSearch');
let groupSearch = require('./services/groupSearch');
let groupExpenses = require('./services/groupExpenses');
let addComment = require('./services/addComment');
let deleteComment = require('./services/deleteComment');
let addExpense = require('./services/addExpense');
let totalDashboard = require('./services/totalDashboard');
let dashboardYouAreOwed = require('./services/dashboardYouAreOwed');
let dashboardYouOwe = require('./services/dashboardYouOwe');
let recentActivity = require('./services/recentActivity');
let settleUp = require('./services/settleUp');
let settleUpDropDown = require('./services/settleUpDropdown');

function handleTopicRequest ( topic_name, fname ) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer( topic_name );
    var producer = connection.getProducer();
    console.log( 'server is running ' );
    consumer.on( 'message', function ( message ) {
        console.log( 'message received for ' + topic_name + " ", fname );
        console.log( JSON.stringify( message.value ) );
        var data = JSON.parse( message.value );

        fname.handle_request( data.data, function ( err, res ) {
            console.log( 'after handle' + res );
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify( {
                        correlationId: data.correlationId,
                        data: res
                    } ),
                    partition: 0
                }
            ];
            producer.send( payloads, function ( err, data ) {
                console.log( data );
            } );
            return;
        } );

    } );
}

handleTopicRequest( "login", login )
handleTopicRequest( "signup", signup )
handleTopicRequest( "viewProfile", viewProfile )
handleTopicRequest( "updateProfile", updateProfile )
handleTopicRequest( "createGroup", createGroup )
handleTopicRequest( "updateGroup", updateGroup )
handleTopicRequest( "groupDetails", groupDetails )
handleTopicRequest( "acceptRejectInvite", acceptRejectInvite )
handleTopicRequest( "myGroupsPending", myGroupsPending )
handleTopicRequest( "myGroups", myGroups )
handleTopicRequest( "groupUserSearch", groupUserSearch )
handleTopicRequest( "groupSearch", groupSearch )
handleTopicRequest( "groupExpenses", groupExpenses )
handleTopicRequest( "addComment", addComment )
handleTopicRequest( "deleteComment", deleteComment )
handleTopicRequest( "addExpense", addExpense )
handleTopicRequest( "totalDashboard", totalDashboard )
handleTopicRequest( "dashboardYouAreOwed", dashboardYouAreOwed )
handleTopicRequest( "dashboardYouOwe", dashboardYouOwe )
handleTopicRequest( "recentActivity", recentActivity )
handleTopicRequest( "settleUp", settleUp )
handleTopicRequest( "settleUpDropDown", settleUpDropDown )