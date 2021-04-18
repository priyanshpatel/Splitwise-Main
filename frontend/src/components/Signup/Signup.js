import React, { Component } from 'react';
import '../../App.css';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import { BrowserRouter, Link } from 'react-router-dom';
import config from "../../config/config";
import { useHistory } from 'react-router-dom';
import signUpAction from '../../actions/signUpAction';
import { connect } from "react-redux";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            userName: "",
            userEmail: "",
            userPassword: "",
            Msg: "",
            MsgFlag: false
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }
    emailChangeHandler = (e) => {
        this.setState({
            userEmail: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            userPassword: e.target.value
        })
    }
    nameChangeHandler = (e) => {
        this.setState({
            userName: e.target.value
        })
    }
    submitSignup = (e) => {
        e.preventDefault();
        this.props.signUpAction(this.state)

        // const data = {
        //     userName: this.state.name,
        //     userEmail: this.state.email,
        //     userPassword: this.state.password
        // }
        // axios.defaults.withCredentials = true;
        // axios.post(config.API_URL + '/signup', data)
        //     .then(response => {
        //         if (response.status === 200) {
        //             console.log("Sign up success");
        //             this.setState({
        //                 MsgFlag: false,
        //                 Msg: "Sign up success",
        //                 userID: response.data.userID
        //             })
        //             // this.props.history.push("/login")
        //             const data = {
        //                 userEmail: this.state.email,
        //                 userPassword: this.state.password
        //             }
        //             axios.defaults.withCredentials = true;
        //             // axios.post('http://localhost:3001/login', data)
        //             axios.post(config.API_URL + '/login', data)
        //                 .then(response => {
        //                     if (response.status === 200) {
        //                         //redirect to dashboard
        //                         this.setState({
        //                             authFlag: false,
        //                             MsgFlag: false,
        //                             Msg: "login success",
        //                             userID: response.data.userID
        //                         })
        //                         cookie.save('userID', response.data.userID, { path: '/' })
        //                         cookie.save('userEmail', response.data.userEmail, { path: '/' })
        //                         cookie.save('userName', response.data.userName, { path: '/' })
        //                         cookie.save('phoneNumber', response.data.phoneNumber, { path: '/' })
        //                         cookie.save('timezone', response.data.timezone, { path: '/' })
        //                         cookie.save('currency', response.data.currency, { path: '/' })
        //                         cookie.save('language', response.data.language, { path: '/' })
        //                         cookie.save('profilePicture', response.data.profilePicture, { path: '/' })
        //                         this.props.history.push("/dashboard")
        //                     } else if (response.status === 201) {
        //                         //Invalid credentials
        //                         this.setState({
        //                             authFlag: true,
        //                             MsgFlag: true,
        //                             Msg: "Invalid Credentials"
        //                         })
        //                     } else {
        //                         //login failed
        //                         this.setState({
        //                             authFlag: true,
        //                             MsgFlag: true,
        //                             Msg: "Login Failed"
        //                         })
        //                     }
        //                 }).catch(e => {
        //                     console.log("Inside catch");
        //                 })
        //         }
        //         else if (response.status === 201) {
        //             console.log("Email ID already registered");
        //             this.setState({
        //                 Msg: "Email ID already registered",
        //                 MsgFlag: true
        //             })
        //         }
        //         else {
        //             console.log("Sign up failed");
        //             this.setState({
        //                 Msg: "Sign up failed",
        //                 MsgFlag: true
        //             })
        //         }
        //     })
    }

    // renderError = () => {
    //     if ( this.state.error ) {
    //         return (
    //             <div class="alert alert-danger" role="alert">Email id already exists</div>
    //         )
    //     }
    // }

    render() {
        let renderError = null
        let redirectVar = null;
        if (cookie.load('userId')) {
            redirectVar = <Redirect to="/dashboard" />
        }
        if ( this.props.error ) {
            renderError = <div class="alert alert-danger" role="alert">Email id already exists</div>
        }
        return (
            <div>
                {redirectVar}
                <BrowserRouter>
                    <div>
                        <div>
                            <Navbar />
                        </div>
                        <div class="container">
                            <div class="row div-pad">
                                <div class="col-3"></div>
                                <div class="col-3">
                                    <img src={splitwise_logo} width="250" height="250" alt="" />
                                </div>
                                <div class="col-3">
                                    <span style={{ color: "#8a8f94" }}><strong>INTRODUCE YOURSELF</strong></span><br /><br />
                                    <form onSubmit={this.submitSignup} method="post">
                                        <label><strong>Hi there! My name is</strong></label>
                                        <input class="form-input" onChange={this.nameChangeHandler} type="text" class="form-control" name="name" required></input>
                                        <br />
                                        <label><strong>Email address</strong></label>
                                        <input class="form-input" onChange={this.emailChangeHandler} type="email" class="form-control" name="email" required></input>
                                        <br />
                                        <label><strong>Password</strong></label>
                                        <input class="form-input" onChange={this.passwordChangeHandler} type="password" class="form-control" name="password" required></input>
                                        <br />
                                        <button class="btn btn-primary btn-lg" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Sign me up!</button>
                                    </form>
                                    <br />
                                    { renderError }
                                    {/* {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}
// export default Signup;

const matchStateToProps = (state) => {
    // console.log("inside matchStatetoProps", state)
    return {
        error: state.signUpReducer.error,
        message: state.signUpReducer.message
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        signUpAction: (data) => dispatch(signUpAction(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(Signup)