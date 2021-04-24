import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const DELETE_COMMENT_SUCCESS = "delete_comment_success";
const DELETE_COMMENT_FAILED = "delete_comment_failed";

let success = ( response ) => {
    return {
        type: DELETE_COMMENT_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: DELETE_COMMENT_FAILED,
        payload: {
            response: err,
        }
    }
}

let deleteCommentAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default deleteCommentAction