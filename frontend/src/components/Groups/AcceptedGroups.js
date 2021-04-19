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
        this.state = {
            groupName: this.props.data.groupName,
            _id: this.props.data._id,
            inviteFlag: this.props.data.inviteFlag
        }
    }

    componentDidMount() {
        console.log("----------inside accepted component-------------");
        console.log(this.state._id);
        console.log(this.state.groupName);
        console.log(this.state.inviteFlag);
        console.log(this.props.data);
    }

    render() {
        return (
            <BrowserRouter>
            <div class="card text-dark bg-light mb-3" style={{width: '38rem'}}>
                <div class="card-body">
                    <h6 class="card-title"><strong>{this.state.groupName}</strong></h6>
                    <a href={"/grouppage/"+this.state._id} class="btn btn-outline-primary">Details</a>&nbsp;
                    <a href="" class="btn btn-outline-danger" onClick={this.props.leaveGroup.bind(this, this.state)}>Leave</a>&nbsp;
                    {/* <a href="" class="btn btn-outline-secondary" onClick={this.props.editGroup.bind(this, this.state)}>Edit</a> */}
                </div>
            </div>
            </BrowserRouter>
        )
    }
}
export default AcceptedGroups;