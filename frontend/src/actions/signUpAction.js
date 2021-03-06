import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";
import jwt_decode from "jwt-decode";

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
            console.log("Sign upppppp", response)
            if (response.status === 200) {
                console.log("insideee succceessss")
                let decoded = jwt_decode(response.data.toString())
                console.log("decoded", decoded)

                cookie.save('token', response.data, { path: '/' })
                cookie.save('userId', decoded._id, { path: '/' })
                cookie.save('userEmail', decoded.userEmail, { path: '/' })
                cookie.save('userName', decoded.userName, { path: '/' })
                dispatch(successUser(decoded, data))
                // window.location.assign( '/dashboard' )
                this.props.history.push('/dashboard')
            } else if (response.status === 201){
                dispatch(errorUser(response, data))
            }

        })
        .catch((err) => {
            console.log("insiddeeee catchhhccchhh", err)
            dispatch(errorUser(err, data))

        });
}

export default userSignUpAction