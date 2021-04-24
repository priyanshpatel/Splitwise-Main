import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const SETTLE_UP_SUCCESS = "settle_up_success";
const SETTLE_UP_FAILED = "settle_up_failed";

let success = ( response ) => {
    return {
        type: SETTLE_UP_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: SETTLE_UP_FAILED,
        payload: {
            response: err,
        }
    }
}

let settleUpAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default settleUpAction