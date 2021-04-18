import axios from 'axios';
import API_URL from '../config/config'
import cookie from "react-cookies";
import jwt_decode from "jwt-decode";

const USER_LOGIN_SUCCESS = "user_login_success";
const USER_LOGIN_FAILED = "user_login_failed";

let successUser = (response, data) => {
    return {
        type: USER_LOGIN_SUCCESS,
        payload: {
            response: response,
            data: data
        }
    }
}

let errorUser = (err, data) => {
    return {
        type: USER_LOGIN_FAILED,
        payload: {
            response: err,
            data: data
        }
    }
}

// const data = {
//     userEmail: this.state.email,
//     userPassword: this.state.password
// }

let loginAction = (data) => (dispatch) => {
    axios.defaults.withCredentials = true;
    // axios.post('http://localhost:3001/login', data)
    axios.post(API_URL + '/login', data)
        .then(response => {
            console.log(typeof response.data)
            console.log(response.data)
            
            if (response.status === 200) {
                let decoded = jwt_decode(response.data.toString().split(' ')[1])
                console.log("decoded", decoded)
                //redirect to dashboard
                // this.setState({
                //     authFlag: false,
                //     MsgFlag: false,
                //     Msg: "login success",
                //     userID: decoded._id
                // })
                cookie.save('token', response.data, { path: '/' })
                cookie.save('userId', decoded._id, { path: '/' })
                cookie.save('userEmail', decoded.userEmail, { path: '/' })
                cookie.save('userName', decoded.userName, { path: '/' })
                cookie.save('phoneNumber', decoded.phoneNumber, { path: '/' })
                cookie.save('timezone', decoded.timezone, { path: '/' })
                cookie.save('currency', decoded.currency, { path: '/' })
                cookie.save('language', decoded.language, { path: '/' })
                cookie.save('profilePicture', decoded.profilePicture, { path: '/' })
                dispatch(successUser(decoded, data))
                // this.props.history.push("/dashboard")
            } else if (response.status === 401) {
                //Invalid credentials
                // this.setState({
                //     authFlag: true,
                //     MsgFlag: true,
                //     Msg: "Invalid Credentials"
                // })
                let decoded = jwt_decode(response.data.split(' ')[1])
                dispatch(errorUser(decoded, data))
            }
            // else {
            //     // login failed
            //     this.setState({
            //         authFlag: true,
            //         MsgFlag: true,
            //         Msg: "Login Failed"
            //     })
            //     dispatch( errorUser( err, data ) )
            // }
        }).catch(e => {
            console.log(e);
            dispatch(errorUser(e, data))
        })
}

export default loginAction