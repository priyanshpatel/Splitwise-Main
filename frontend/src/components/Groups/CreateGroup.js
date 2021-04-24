import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import API_URL from "../../config/config";
import { connect } from "react-redux";
import createGroupAction from '../../actions/createGroupAction';

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            groupMembers: [],
            groupName: '',
            groupPicture: '',
            errorMessage: '',
            authFlag: null,
            MsgFlag: false,
            imageUpdateFlag: false,
            image: null,
            updateFlag: false,
            groupAddFlag: false,
            Msg: ""
        }
    }
    componentWillMount() {
        this.setState({
            userId: cookie.load('userId')
        })
    }

    searchOptions = (inp, callback) => {
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/groups/search/users?keyword=' + inp +'&userId='+ cookie.load('userId'))
            .then(response => {
                if (response.status === 200) {
                    const searchedUsers = response.data.map((user) => {
                        return {
                            label: user.userName + "(" + user.userEmail + ")",
                            value: user._id,
                        };
                    });
                    callback(searchedUsers)
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

    };

    groupNameChangeHandler = (e) => {
        this.setState({
            groupName: e.target.value
        })
    }

    handleImageChange = (e) => {
        this.setState({
            imageUpdateFlag: true,
            image: URL.createObjectURL(e.target.files[0]),
            groupPicture: e.target.files[0],
        })
    }

    groupSave = (e) => {
        e.preventDefault();
        if (this.state.groupMembers == null) {
            this.setState({
                MsgFlag: true,
                errorMessage: "Please select group members"
            })
        }
        else {
            let acceptedUsersList = []
            let formData = new FormData();
            if (this.state.imageUpdateFlag) {
                formData.append(
                    "groupPicture",
                    this.state.groupPicture,
                    this.state.groupPicture.name
                );
            }
            // We need to send a list of userIds.
            const userIdList = this.state.groupMembers.map((groupMember) => {
                return groupMember.value;
            });
            acceptedUsersList.push(cookie.load('userId'))

            formData.append("userId", cookie.load('userId'));
            formData.append("groupName", this.state.groupName);
            // formData.append("groupMembers", this.state.groupMembers);
            formData.append("invitedUsers", userIdList.join());
            formData.append("acceptedUsers", acceptedUsersList);

            // const data = {
            //     userID: parseInt(cookie.load('userID')),
            //     groupName: this.state.groupName,
            //     groupMembers: this.state.groupMembers,
            //     groupPicture: this.state.groupPicture
            // };
            // console.log("============Group Save==============");
            // console.log(data);

            axios.defaults.headers.common["authorization"] = cookie.load('token')
            axios.defaults.withCredentials = true;
            axios.post(API_URL + '/groups/create', formData, {
                headers: Object.assign(
                    { "content-type": "multipart/form-data" }
                )
            })
                .then(response => {
                    console.log(response);
                    if (response.status === 200) {
                        this.setState({
                            authFlag: true,
                            MsgFlag: false,
                            groupAddFlag: true,
                            Msg: "Group successfully created"
                        })
                        console.log("Group successfully created");

                        let createGroupActionData = {
                            response: response.data,
                            status: true
                        }
                        this.props.createGroupAction(createGroupActionData)

                        //window.location.assign('/profile/' + cookie.load('userID'))
                        //this.props.history.push("/dashboard")
                        //window.location.reload()
                        // this.props.history.push("/mygroups")
                        window.location.assign("/mygroups")
                    } else if (response.status === 201) {
                        this.setState({
                            authFlag: true,
                            MsgFlag: true,
                            errorMessage: "Group name already exists."
                        })
                        console.log("Group Name already exists");
                        let createGroupActionData = {
                            response: "Group Name already exists",
                            status: false
                        }
                        this.props.createGroupAction(createGroupActionData)
                    }
                }).catch(e => {
                    console.log(e);
                    this.setState({
                        authFlag: false,
                        MsgFlag: true,
                        errorMessage: e
                    })
                    let createGroupActionData = {
                        response: e,
                        status: false
                    }
                    this.props.createGroupAction(createGroupActionData)
                })
        }
    }

    usersChangeHandler = (e) => {
        this.setState({
            groupMembers: e
        })
    }

    render() {
        let redirectVar = null;
        if (!cookie.load('userId')) {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div>
                {redirectVar}
                    <div>
                        <Navbar />
                    </div>
                    <div class="container">
                        <div class="row div-pad">
                            <div class="col-3"></div>
                            <div class="col-3">
                                {this.state.image == null ? <img src={API_URL + '/uploads/profile/default_profile.png'} width="200" height="200" alt="" /> : <img src={this.state.image} width="200" height="200" alt="" />}
                                {/* {this.state.image != null ? <img src={this.state.image} width="200" height="200" alt="" /> : <img src={config.API_URL + '/uploads/profile/default_profile.png'} width="200" height="200" alt="" />} */}
                                <input
                                    accept="image/x-png,image/gif,image/jpeg"
                                    type="file"
                                    name="groupPicture"
                                    onChange={this.handleImageChange}
                                />
                            </div>
                            <div class="col-3">
                                <span style={{ color: "#8a8f94" }}><strong>START A NEW GROUP</strong></span>
                                <form onSubmit={this.groupSave} method="post">
                                    <label for="groupName"><strong>My group shall be called...</strong></label>
                                    <input class="form-input" style={{ fontWeight: "bold" }} onChange={this.groupNameChangeHandler} type="text" id="groupName" class="form-control" name="groupName" required></input>
                                    <br />
                                    <label><strong>GROUP MEMBERS</strong></label>
                                    <AsyncSelect
                                        isMulti
                                        value={this.state.users}
                                        onChange={this.usersChangeHandler}
                                        placeholder={"Search by name or email"}
                                        loadOptions={this.searchOptions}
                                    />
                                    <br />
                                    <button class="btn btn-primary" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }}>Save</button>
                                    <br /><br />
                                    {this.state.MsgFlag ? <div class="alert alert-danger" role="alert">{this.state.errorMessage}</div> : null}
                                    {this.state.groupAddFlag ? <div class="alert alert-success" role="alert">{this.state.Msg}</div> : null}
                                </form>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}
// export default CreateGroup;

const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        error: state.groupReducer.error,
        message: state.groupReducer.message
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        createGroupAction: (data) => dispatch(createGroupAction(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(CreateGroup)