import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
// import AsyncSelect from "react-select/async";

class PendingGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: this.props.data.groupName,
            groupId: this.props.data._id,
            inviteFlag: this.props.data.inviteFlag
        }
    }

    componentDidMount() {
        console.log("----------inside pending-------------");
        console.log(this.state.groupId);
        console.log(this.state.groupName);
        console.log(this.state.inviteFlag);
        // console.log(this.state.group);
    }

    render() {
        return (
            <div class="card text-dark bg-light mb-3" style={{ width: '38rem' }}>
                <div class="card-body">
                    <h6 class="card-title"><strong>{this.state.groupName}</strong></h6>
                    <button onClick={this.props.acceptInvite.bind(this, this.state)} class="btn btn-outline-success">Accept</button>&nbsp;
                    <a onClick={this.props.rejectInvite.bind(this, this.state)} class="btn btn-outline-secondary">Reject</a>
                </div>
            </div>
        )
    }
}
export default PendingGroups;