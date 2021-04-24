import React, { Component } from 'react';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
// import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
// import { Button } from 'semantic-ui-react'

class AcceptedGroups extends Component {
    constructor(props) {
        super(props);
        // console.log("this.props",this.props.data)
        this.state = {
            groupName: this.props.data.groupName,
            groupId: this.props.data._id,
            inviteFlag: this.props.data.inviteFlag
        }
        // console.log("this.state", this.state)
    }

    componentDidMount() {
        console.log("----------inside accepted component-------------");
        console.log(this.state.groupId);
        console.log(this.state.groupName);
        console.log(this.state.inviteFlag);
        console.log(this.props.data);
    }

    render() {
        return (
            <div class="card text-dark bg-light mb-3" style={{width: '38rem'}}>
                <div class="card-body">
                    <h6 class="card-title"><strong>{this.state.groupName}</strong></h6>
                    <Link to={"/grouppage/"+this.state.groupId} class="btn btn-outline-primary">Details</Link>&nbsp;
                    <a href="" class="btn btn-outline-danger" onClick={this.props.leaveGroup.bind(this, this.state)}>Leave</a>&nbsp;
                    {/* <a href="" class="btn btn-outline-secondary" onClick={this.props.editGroup.bind(this, this.state)}>Edit</a> */}
                </div>
            </div>
        )
    }
}
export default AcceptedGroups;