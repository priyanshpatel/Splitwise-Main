import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const ADD_COMMENT_SUCCESS = "add_comment_success";
const ADD_COMMENT_FAILED = "add_comment_failed";

let success = ( response ) => {
    return {
        type: ADD_COMMENT_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: ADD_COMMENT_FAILED,
        payload: {
            response: err,
        }
    }
}

let addCommentAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default addCommentAction