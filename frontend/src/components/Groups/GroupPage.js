import React, { Component } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import cookie, { plugToRequest } from 'react-cookies';
import { Redirect } from 'react-router';
import Navbar from '../LandingPage/Navbar';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import PropTypes from 'prop-types';
import Moment from 'react-moment'
import Modal from 'react-modal';
import AddExpense from "./AddExpense"
import API_URL from "../../config/config";
import EditGroup from "./EditGroup"
import { Accordion, Card } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa'

const customStyles = {
    content: {
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        height: "400px",
        width: "500px",
        transform: "translate(-50%, -50%)",
    },
};

const customStyles_2 = {
    content: {
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        height: "500px",
        width: "500px",
        transform: "translate(-50%, -50%)",
    },
};

class GroupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: "",
            groupId: null,
            userId: null,
            groupExpenses: [],
            groupBalances: [],
            addExpensePopUp: false,
            editGroupPopUp: false,
            groupPicture: "",
            image: null,
            groupBalances: null
        }
    }

    componentDidMount() {
        const groupId = this.props.match.params.groupid
        this.setState({
            groupId: this.props.match.params.groupid,
            userId: cookie.load('userId')
        })

        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/groups/groupdetails/' + groupId)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        groupName: response.data.groupName,
                        groupPicture: response.data.groupPicture,
                        image: API_URL + "/" + response.data.groupPicture,
                        groupBalances: response.data.groupBalances
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        axios.get(API_URL + '/groups/groupexpenses/' + groupId)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        groupExpenses: response.data
                    });
                }
            }).catch(e => {
                console.log("inside catch");
                console.log(e);
            })

        // axios.get(API_URL + '/groups/groupbalances/' + this.props.match.params.groupid)
        //     .then(response => {
        //         if (response.status === 200) {
        //             this.setState({
        //                 groupBalances: response.data
        //             });
        //         }
        //     }).catch(e => {
        //         console.log("inside catch");
        //         console.log(e);
        //     })
    }

    toggleAddExpense = () => {
        this.setState({
            addExpensePopUp: !this.state.addExpensePopUp
        })
    }

    toggleEditGroup = () => {
        this.setState({
            editGroupPopUp: !this.state.editGroupPopUp
        })
    }

    commentChangeHandler = (e) => {
        this.setState({
            comment: e.target.value
        })
    }

    addComment = (expense) => {
        console.log("++++inside add comment++++", expense)
        // e.preventDefault();
        if (this.state.comment == null){
            //Write code here
        } else {
            const data = {
                description: this.state.comment,
                AddedByUserId: this.state.userId,
                //expenseId: 
            }
        }
    }

    render() {
        // const moment = require('moment')
        let redirectVar = null;
        if (!cookie.load('userId')) {
            redirectVar = <Redirect to="/" />
        };

        let groupExpenses = <div>No expenses</div>;
        if (this.state.groupExpenses != null) {
            groupExpenses = this.state.groupExpenses.map((expense) => {
                // return <div class="card text-dark bg-light" style={{ width: '38rem' }}>
                //     <div class="card-body">
                //         <div class="row">
                //             <div class="col-7">
                //                 <div class="row">
                //                     <div class="col-3">
                //                         <h6 class="card-title" style={{ paddingLeft: "15px", paddingTop: "15px", color: "#8a8f94" }}><strong><Moment format="MMM DD">{expense.createdAt}</Moment></strong></h6>
                //                     </div>
                //                     <div class="col-9">
                //                         {expense.settleFlag == 'Y' && expense.paidByUserId == this.state.userId ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>You and {expense.settledWithUserName} settled up</strong></h6> : null}
                //                         {expense.settleFlag == 'Y' && expense.settledWithUserId[0] == this.state.userId ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>You and {expense.paidByUserName} settled up</strong></h6> : null}
                //                         {expense.settleFlag == 'Y' && expense.settledWithUserId[0] != this.state.userId && expense.paidByUserId != this.state.userId ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>{expense.paidByUserName} and {expense.settledWithUserName} settled up</strong></h6> : null}
                //                         {expense.settleFlag == 'N' ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>{expense.description}</strong></h6> : null}
                //                     </div>
                //                 </div>
                //             </div>
                //             <div class="col-5">
                //                 <div class="row">
                //                     {expense.settleFlag == 'N' && expense.paidByUserId != this.state.userId ? <h6 class="card-title" style={{ textAlign: "right", color: "#8a8f94" }}><strong>{expense.paidByUserName + " Paid"}</strong></h6> : null}
                //                     {expense.settleFlag == 'N' && expense.paidByUserId == this.state.userId ? <h6 class="card-title" style={{ textAlign: "right", color: "#8a8f94" }}><strong>{"You Paid"}</strong></h6> : null}
                //                 </div>
                //                 <div class="row">
                //                     {expense.settleFlag == 'N' ? <h6 class="card-title" style={{ textAlign: "right" }}><strong>{expense.currency + expense.amount}</strong></h6> : null}
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // </div>

                return <Accordion style={{ width: '100%' }}>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            <div class="row">
                                <div class="col-7">
                                    <div class="row">
                                        <div class="col-3">
                                            <h6 class="card-title" style={{ paddingLeft: "15px", paddingTop: "15px", color: "#8a8f94" }}><strong><Moment format="MMM DD">{expense.createdAt}</Moment></strong></h6>
                                        </div>
                                        <div class="col-9">
                                            {expense.settleFlag == 'Y' && expense.paidByUserId == this.state.userId ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>You and {expense.settledWithUserName} settled up</strong></h6> : null}
                                            {expense.settleFlag == 'Y' && expense.settledWithUserId[0] == this.state.userId ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>You and {expense.paidByUserName} settled up</strong></h6> : null}
                                            {expense.settleFlag == 'Y' && expense.settledWithUserId[0] != this.state.userId && expense.paidByUserId != this.state.userId ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>{expense.paidByUserName} and {expense.settledWithUserName} settled up</strong></h6> : null}
                                            {expense.settleFlag == 'N' ? <h6 class="card-title" style={{ paddingTop: "18px" }}><strong>{expense.description}</strong></h6> : null}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-5">
                                    <div class="row">
                                        {expense.settleFlag == 'N' && expense.paidByUserId != this.state.userId ? <h6 class="card-title" style={{ textAlign: "right", color: "#8a8f94" }}><strong>{expense.paidByUserName + " Paid"}</strong></h6> : null}
                                        {expense.settleFlag == 'N' && expense.paidByUserId == this.state.userId ? <h6 class="card-title" style={{ textAlign: "right", color: "#8a8f94" }}><strong>{"You Paid"}</strong></h6> : null}
                                    </div>
                                    <div class="row">
                                        {expense.settleFlag == 'N' ? <h6 class="card-title" style={{ textAlign: "right" }}><strong>{expense.currency + expense.amount}</strong></h6> : null}
                                    </div>
                                </div>
                            </div>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <div
                                    className= "task"
                                    // onDoubleClick={() => onToggle(task.id)}
                                >
                                    <h3>
                                        {/* {task.text}{' '} */}
                                        Sample Comment
                                        <FaTimes
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            // onClick={() => onDelete(task.id)}
                                        />
                                    </h3>
                                    <p>today</p>
                                    <hr/>
                                </div>
                                <div
                                    className= "task"
                                    // onDoubleClick={() => onToggle(task.id)}
                                >
                                    <h3>
                                        {/* {task.text}{' '} */}
                                        Sample Comment
                                        <FaTimes
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            // onClick={() => onDelete(task.id)}
                                        />
                                    </h3>
                                    <p>today</p>
                                    <hr/>
                                </div>

                                {/* <form method="post"> */}
                                    <div class="row">
                                        <div class="col-9">
                                            <div class="row">
                                                <div class="col-5">
                                                    <strong>Add a comment:</strong>
                                                    {/* <div class="mb-3">
                                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" style={{ fontSize: "1.2em", width: "700px" }}></textarea>
                                                </div> */}
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-5">
                                                    <div class="mb-3">
                                                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" onChange={this.commentChangeHandler} style={{ fontSize: "1.2em", width: "500px" }}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-2">
                                                    {/* <button>Post</button> */}
                                                    <button class="btn btn-primary" type="submit" style={{ backgroundColor: "#ed752f", border: "none" }} onClick={this.addComment.bind(this, this.state)}><strong>Post</strong></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/* </form> */}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            })
        }

        let groupBalances = <div>No group balances</div>

        if (this.state.groupBalances != null) {
            console.log("=====groupBalances======", this.state.groupBalances)
            groupBalances = this.state.groupBalances.map((expense) => {
                return <div class="card text-dark" style={{ width: '15rem' }}>
                    <div class="card-body">
                        {expense.userId != this.state.userId ? <h6 class="card-title"><strong>{expense.userName}</strong></h6> : <h6 class="card-title"><strong>{"Your balance:"}</strong></h6>}
                        <h6 class="card-title"><strong>{expense.currency}</strong></h6>
                        {expense.balance < 0 ? <h6 class="card-title" style={{ color: "#ed752f" }}><strong>{"Owes $" + Math.abs(expense.balance)}</strong></h6> : null}
                        {expense.balance > 0 ? <h6 class="card-title" style={{ color: "#59cfa7" }}><strong>{"Gets back $" + expense.balance}</strong></h6> : null}
                        {expense.balance == 0 ? <h6 class="card-title" style={{ color: "#59cfa7" }}><strong>{"Balances settled up"}</strong></h6> : null}
                    </div>
                </div>
            })
        }

        return (
            <div>
                {redirectVar}
                <div>
                    <Navbar />
                </div>
                <br />
                <div class="container">
                    <div class="row">
                        {/* <div class="col-2">

                        </div> */}
                        <div class="col-6">
                            <h3><strong>{this.state.groupName}  <button class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.toggleEditGroup}><i class="fa fa-edit"></i></button></strong></h3><br />
                        </div>
                        <div class="col-4">
                            <button class="btn btn-primary" style={{ backgroundColor: "#ed752f", border: "none" }} onClick={this.toggleAddExpense}><strong>Add an expense</strong></button>
                        </div>
                        <div class="col-2">

                        </div>
                        <hr></hr>
                    </div>
                    <div class="row">
                        {/* <div class="col-2">

                        </div> */}
                        <div class="col-8">
                            {groupExpenses}
                            <br></br>
                        </div>
                        {/* <div class="col-3">

                        </div> */}
                        <div class="col-1">

                        </div>
                        <div class="col-3">
                            <h6 style={{ color: "#8a8f94" }}><strong>GROUP BALANCES</strong></h6>
                            {groupBalances}
                        </div>
                        <hr></hr>
                    </div>
                    <Modal style={customStyles} isOpen={this.state.addExpensePopUp} ariaHideApp={false}>
                        <AddExpense data={this.state} closePopUp={this.toggleAddExpense} />
                    </Modal>
                    <Modal style={customStyles_2} isOpen={this.state.editGroupPopUp} ariaHideApp={false}>
                        <EditGroup data={this.state} closePopUp={this.toggleEditGroup} />
                    </Modal>
                </div>
            </div>
        )
    }
}
export default GroupPage;