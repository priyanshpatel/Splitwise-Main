import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const GET_DASHBOARD_SUCCESS = "get_dashboard_success";
const GET_DASHBOARD_FAILED = "get_dashboard_failed";

let success = ( response ) => {
    return {
        type: GET_DASHBOARD_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: GET_DASHBOARD_FAILED,
        payload: {
            response: err,
        }
    }
}

let getDashboardAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default getDashboardAction