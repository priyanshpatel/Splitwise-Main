import React, { Component } from 'react';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
// import { Button } from 'semantic-ui-react'
import API_URL from "../../config/config";

class EditGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: this.props.data.groupName,
            groupId: this.props.data.groupId,
            groupPicture: this.props.data.groupPicture,
            userId: this.props.data.userId,
            editGroupPopUp: this.props.data.editGroupPopUp,
            MsgFlag: false,
            Msg: "",
            imageUpdateFlag: false,
            image: this.props.data.image,
            authFlag: false,
            updateFlag: false,
            groupPicture: ""
        }
    }
    
    handleImageChange = (e) => {
        this.setState({
            imageUpdateFlag: true,
            image: URL.createObjectURL(e.target.files[0]),
            groupPicture: e.target.files[0],
        })
    }

    groupNameChangeHandler = (e) => {
        e.preventDefault()
        this.setState({
            groupName: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        if (this.state.imageUpdateFlag) {
            formData.append(
                "groupPicture",
                this.state.groupPicture,
                this.state.groupPicture.name
            );
        }
        formData.append("groupId", this.state.groupId);
        formData.append("groupName", this.state.groupName);

        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.post(API_URL + '/groups/update', formData, {
            headers: Object.assign(
                { "content-type": "multipart/form-data" }
            )
        })
            .then(response => {
                // this.setState({
                //     authFlag: true,
                //     updateFlag: true,
                //     Msg: "Profile successfully updated"
                // })
                if (response.status === 200) {
                    console.log("inside 200", response)
                    this.setState({
                        authFlag: true,
                        updateFlag: true,
                        Msg: "Profile successfully updated"
                    })
                    window.location.reload()
                } else if (response.status === 201) {
                    this.setState({
                        MsgFlag: true,
                        Msg: "Group name already exists"
                    })
                }
            }).catch(e => {
                console.log(e);
                this.setState({
                    authFlag: false,
                    errorMessage: e
                })
            })

    }

    render() {
        let renderError = null
        if ( this.state.MsgFlag ) {
            renderError = <div class="alert alert-danger" role="alert">{this.state.Msg}</div>
        }
        return (
            <div class="container">
                <div class="row">
                    <div class="col-11">
                        <h6><strong>Edit group</strong></h6>
                        <hr></hr>
                    </div>
                    <div class="col-1" style={{ textAlign: "right" }}>
                        {/* <i class="fa fa-times button"></i> */}
                        <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }} onClick={this.props.closePopUp}><i class="fa fa-times button"></i></button>
                    </div>
                </div>
                {/* <div class="row">
                    <div class="col-12">
                        <h6>With <strong>you</strong> and all of <strong>{this.state.GROUP_NAME}</strong></h6>
                        <hr></hr>
                    </div>
                </div> */}
                <div class="row">
                    <form method="post">
                        <div class="input-group mb-3">
                            <input type="text" name="groupName" class="form-control" id="groupName" placeholder="Enter a description" value={this.state.groupName} style={{ fontWeight: "bold" }} onChange={this.groupNameChangeHandler} required></input>
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group mb-3">
                                <strong>Upload group picture</strong>
                            </div>
                            {this.state.image != API_URL + '/null' ? <img src={this.state.image} width="200" height="200" alt="" /> : <img src={API_URL + '/uploads/profile/default_profile.png'} width="200" height="200" alt="" />}
                            <input
                                accept="image/x-png,image/gif,image/jpeg"
                                type="file"
                                name="groupPicture"
                                onChange={this.handleImageChange}
                            />

                            {/* <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input type="number" class="form-control" name="amount" step=".01" placeholder="0.00" min="0.01" style={{ fontWeight: "bold" }} onChange={this.amountValidate} required /> */}
                        </div>
                        <button type="submit" class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.handleSubmit}><strong>Submit</strong></button>
                    </form>
                </div><br />
                {renderError}
                {/* {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.Msg}</div> : null} */}
            </div>
        )
    }
}
export default EditGroup;