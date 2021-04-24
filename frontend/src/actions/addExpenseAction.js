import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const ADD_EXPENSE_SUCCESS = "add_expense_success";
const ADD_EXPENSE_FAILED = "add_expense_failed";

let success = ( response ) => {
    return {
        type: ADD_EXPENSE_SUCCESS,
        payload: {
            response: response,
        }
    }
}

let error = ( err ) => {
    console.log( "err", err )
    return {
        type: ADD_EXPENSE_FAILED,
        payload: {
            response: err,
        }
    }
}

let addExpenseAction = ( data ) => ( dispatch ) => {

    // axios.defaults.headers.common[ "authorization" ] = cookie.load( 'token' )
    // axios.defaults.withCredentials = true;

    if (data.status){
        dispatch( success( data.response ) )
    } else {
        dispatch( error( data.response ) )
    }
}

export default addExpenseAction