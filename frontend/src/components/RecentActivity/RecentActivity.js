import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import splitwise_logo from '../../images/splitwise_logo.png';
import axios from 'axios';
import Moment from 'react-moment';
import API_URL from "../../config/config";
import ReactPaginate from 'react-paginate';

class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            groupSort: null,
            sort: null,
            activityData: [],
            groups: [],
            offset: 0,
            perPage: 2,
            pageCount: 0,
        }
    }
    componentWillMount() {
        this.setState({
            userId: parseInt(cookie.load('userId')),
            groupSort: 0,
            sort: 2
        })
    }
    componentDidMount() {
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;

        axios.get(API_URL + '/groups/mygroups/' + cookie.load('userId'))
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        groups: response.data
                    });
                } else if (response.status === 201) {
                    console.log("My groupsssssss========>>>>", response.data);
                }
            }).catch(e => {
                console.log(e);
            })
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/activities/recent_activity/' + cookie.load('userId') + '/' + this.state.groupSort + '/' + this.state.sort)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data,
                        pageCount: Math.ceil(response.data.length / this.state.perPage)
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    handleSort = (e) => {
        e.preventDefault()
        this.setState({
            sort: e.target.value
        })
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/activities/recent_activity/' + cookie.load('userId') + '/' + this.state.groupSort + '/' + e.target.value)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data,
                        pageCount: Math.ceil(response.data.length / this.state.perPage)
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    handleGroupSort = (e) => {
        e.preventDefault()
        this.setState({
            groupSort: e.target.value
        })
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/activities/recent_activity/' + cookie.load('userId') + '/' + e.target.value + '/' + this.state.sort)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data,
                        pageCount: Math.ceil(response.data.length / this.state.perPage)
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    handlePageClick = (e) => {
        this.setState({
            offset: this.state.perPage * e.selected,
        })
    };

    handlePageSizeChange = (e) => {

        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/activities/recent_activity/' + cookie.load('userId') + '/' + this.state.groupSort + '/' + this.state.sort)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        activityData: response.data,
                        perPage: e.target.value,
                        pageCount: Math.ceil(response.data.length / e.target.value)
                    })
                }
            }).catch(e => {
                console.log(e);
            })
    }

    render() {
        let dropDownGroups = this.state.groups.length > 0
            && this.state.groups.map((item, i) => {
                return (
                    <option key={i} value={item._id}>{item.groupName}</option>
                )
            }, this);

        let activityData = <div>You don't owe anything</div>
        if (this.state.activityData != null || this.state.activityData.length < 1) {
            // activityData = this.state.activityData.map((activity) => {
            activityData = this.state.activityData.slice(this.state.offset, this.state.offset + this.state.perPage).map((activity) => {
                return <div class="card text-dark bg-light" style={{ width: '81rem' }}>
                    <div class="card-body">
                        <h6 class="card-title"><strong>{activity.activityDescription}</strong></h6>
                        <p class="card-text">{activity.expenseDescription}</p>
                        <p class="card-text" style={{ color: "#8a8f94" }}><strong><Moment format="MMM DD">{activity.createdAt}</Moment></strong></p>
                    </div>
                </div>
            })
        }


        let redirectVar = null;
        if (!cookie.load('userId')) {
            redirectVar = <Redirect to="/" />
        }

        let pageCount = this.state.pageCount

        return (
            <div>
                {redirectVar}
                <div>
                    <Navbar />
                    <br />
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-5">
                            <h2>Recent Activity</h2>
                        </div>
                        <div class="col-2" style={{ textAlign: "right" }}>
                            <div class="input-group mb-3">
                                <select class="form-select" style={{ fontWeight: "bold" }} aria-label="user select" onChange={this.handlePageSizeChange}>
                                    <option selected value="2">Page Size: 2</option>
                                    <option value="5">Page Size: 5</option>
                                    <option value="10">Page Size: 10</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-2" style={{ textAlign: "right" }}>
                            <div class="input-group mb-3">
                                <select class="form-select" style={{ fontWeight: "bold" }} aria-label="user select" onChange={this.handleSort}>
                                    <option selected value="2">Newest first</option>
                                    <option value="1">Oldest first</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-2" style={{ textAlign: "right" }}>
                            <div class="input-group mb-3">
                                <select class="form-select" style={{ fontWeight: "bold" }} aria-label="user select" onChange={this.handleGroupSort}>
                                    <option selected value="0">All groups</option>
                                    {dropDownGroups}
                                </select>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div class="row">
                        <div class="col-12">
                            {activityData}
                            {activityData.length < 1 ? <div class="alert alert-success" role="alert">No activities</div> : null}
                        </div>
                    </div>
                    <br />
                    <div class="row" style={{ width: "50%", margin: "auto", paddingLeft: "250px" }} >
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default RecentActivity;