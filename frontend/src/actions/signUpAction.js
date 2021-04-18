import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";

const SIGNUP_SUCCESS = "signup_success";
const SIGNUP_FAILED = "signup_failed";

let successUser = (response, data) => {
    return {
        type: SIGNUP_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

let errorUser = (err, data) => {
    return {
        type: SIGNUP_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}

let userSignUpAction = (data) => (dispatch) => {
    axios
        .post(API_URL + '/signup', data)
        .then((response) => {
            if (response.status === 200) {
                cookie.save('userId', response._id, { path: '/' })
                cookie.save('userEmail', response.userEmail, { path: '/' })
                cookie.save('userName', response.userName, { path: '/' })
                dispatch(successUser(response, data))
                // window.location.assign( '/login' )
            } else if (response.status === 201){
                dispatch(errorUser(response, data))
            }

        })
        .catch((err) => {
            dispatch(errorUser(err, data))

        });
}

export default userSignUpAction