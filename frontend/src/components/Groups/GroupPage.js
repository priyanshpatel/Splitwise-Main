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
import Comments from "./Comments";
import NewComments from "./NewComments";
import { connect } from "react-redux";
import addComment from '../../actions/addComment';
import deleteComment from '../../actions/deleteComment';


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
        console.log("-------inside comment change handler--------", e)
        // this.setState({
        //     comment: e.target.value
        // })
    }

    addComment = async (newCommentState) => {
        // console.log(expense)
        console.log("++++inside add comment++++", newCommentState)
        // e.preventDefault();
        if (newCommentState.commentDescription != null) {
            const data = {
                description: newCommentState.commentDescription,
                AddedByUserId: this.state.userId,
                expenseId: newCommentState.expenseId
            }
            console.log("data", data)
            try {
                axios.defaults.headers.common["authorization"] = cookie.load('token')
                axios.defaults.withCredentials = true;

                let response = await axios.post(API_URL + '/expenses/addcomment', data)
                
                console.log("Comment Added Successfully", response.data)

                let newGroupExpensesList = []
                let newGroupExpensesObj = {}
                for (let expense of this.state.groupExpenses) {
                    newGroupExpensesObj = {}
                    newGroupExpensesObj = expense
                    if (expense.expenseId == newCommentState.expenseId) {
                        newGroupExpensesObj.comments = response.data.comments
                        console.log(newGroupExpensesObj)
                    }
                    newGroupExpensesList.push(newGroupExpensesObj)
                }
                this.setState({
                    groupExpenses: newGroupExpensesList
                })
                let addCommentActionData = {
                    response: response,
                    status: true
                }
                this.props.addComment(addCommentActionData)
            } catch (error) {
                console.log("Error while adding comment", error);
                let addCommentActionData = {
                    response: error,
                    status: false
                }
                this.props.addComment(addCommentActionData)
            }
        }
    }

    deleteComment = async (args) => {
        // console.log("-------deleteComment----------", args)
        let newGroupExpensesList = []
        let newGroupExpensesObj = {}

        try {
            axios.defaults.headers.common["authorization"] = cookie.load('token')
            axios.defaults.withCredentials = true;

            let response = await axios.post(API_URL + '/expenses/deletecomment', args)
            // console.log("delete api response =>>>>>>>", response)

            for (let expense of this.state.groupExpenses) {
                newGroupExpensesObj = {}
                newGroupExpensesObj = expense
                if (expense.expenseId == args.expenseId) {
                    // console.log("expense>>>>>>>>", expense)
                    newGroupExpensesObj.comments = response.data.comments
                }
                newGroupExpensesList.push(newGroupExpensesObj)
            }
            this.setState({
                groupExpenses: newGroupExpensesList
            })

            let deleteCommentActionData = {
                response: response,
                status: true
            }
            this.props.deleteComment(deleteCommentActionData)

        } catch (error) {
            console.log("Error while deleteing comment", error)
            let deleteCommentActionData = {
                response: error,
                status: false
            }
            this.props.deleteComment(deleteCommentActionData)
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
                console.log("EXPENSE", expense);
                let comments = null
                comments = expense.comments.map((comment) => {
                    return (
                        <Comments
                            key={comment._id}
                            commentDetails={comment}
                            expenseDetails={expense}
                            loggedInUserId={this.state.userId}
                            deleteComment={this.deleteComment} />
                    )
                })

                return (<Accordion style={{ width: '100%' }}>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={expense.expenseId}>
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
                        <Accordion.Collapse eventKey={expense.expenseId}>
                            <Card.Body>
                                {comments}
                                <NewComments
                                    key={expense.expenseId}
                                    expenseDetails={expense}
                                    addComment={this.addComment}
                                />

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>)
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
// export default GroupPage;

const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        error: state.commentsReducer.error,
        message: state.commentsReducer.message
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        addComment: (data) => dispatch(addComment(data)),
        deleteComment: (data) => dispatch(deleteComment(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(GroupPage)