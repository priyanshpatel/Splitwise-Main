import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const GET_PROFILE_SUCCESS = "get_profile_success";
const GET_PROFILE_FAILED = "get_profile_failed";

let success = ( response ) => {
    return {
        type: GET_PROFILE_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: GET_PROFILE_FAILED,
        payload: {
            response: err,
        }
    }
}

let getProfileAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default getProfileAction