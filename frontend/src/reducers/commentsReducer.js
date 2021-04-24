let initialState = {
    addedComments: [],
    commentFlag: false,
    deletedComments: [],
    deleteCommentFlag: false
}

let comments = ( state = initialState, action ) => {
    let newState = { ...state }
    // console.log( newState );
    switch ( action.type ) {
        case "add_comment_success":
            newState.addedComments.push( action.payload.response.data.comments )
            newState.commentFlag = true;
            newState.message = "Comment added";
            return newState;
        case "add_comment_failed":
            newState.error = true;
            newState.message = "Failed adding comment"
            return newState;
        case "delete_comment_success":
            newState.deletedComments.push( action.payload.response.data.comments )
            newState.deleteCommentFlag = true;
            newState.message = "Comment deleted";
            return newState;
        case "delete_comment_failed":
            newState.error = true;
            newState.message = "Failed deleting comment"
            return newState;
        // case "order_cancel_success":
        //     let temp = []
        //     for ( let i = 0; i < newState.Orders.length; i++ ) {
        //         if ( newState.Orders[ i ]._id === action.payload.response.data._id ) {
        //             temp.push( action.payload.response.data )
        //         } else {
        //             temp.push( newState.Orders[ i ] )
        //         }
        //     }
        //     newState.Orders = temp
        //     console.log( "newState.temp", temp )
        //     newState.message = "Order Cancelled";
        //     return newState;
        // case "order_cancel_failed":
        //     newState.error = true;
        //     newState.message = "Failed canceling Order"
        //     return newState;

        default:
            return newState;


    }
}

export default comments