import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const CREATE_GROUP_SUCCESS = "create_group_success";
const CREATE_GROUP_FAILED = "create_group_failed";

let success = ( response ) => {
    return {
        type: CREATE_GROUP_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: CREATE_GROUP_FAILED,
        payload: {
            response: err,
        }
    }
}

let createGroupAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default createGroupAction