import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const UPDATE_PROFILE_SUCCESS = "update_profile_success";
const UPDATE_PROFILE_FAILED = "update_profile_failed";

let success = ( response ) => {
    return {
        type: UPDATE_PROFILE_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: UPDATE_PROFILE_FAILED,
        payload: {
            response: err,
        }
    }
}

let updateProfileAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default updateProfileAction