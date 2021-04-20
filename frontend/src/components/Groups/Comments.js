import React, { Component } from "react";
import { FaTimes } from "react-icons/fa";
import Moment from 'react-moment'
import ConfirmDeleteComment from "./ConfirmDeleteComment"
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        height: "250px",
        width: "500px",
        transform: "translate(-50%, -50%)",
    },
};

class Comments extends Component {
    constructor(props) {
        super(props);
        // console.log("PPPPRRRROOOPPPS", this.props);
        this.state = {
            deleteCommentPopUp: false
        }
    }

    toggleDeleteCommentModal = () => {
        this.setState({
            deleteCommentPopUp: !this.state.deleteCommentPopUp
        })
    }

    deleteThisComment = async (e) => {
        e.preventDefault()
        let args = {
            commentId: this.props.commentDetails._id,
            expenseId: this.props.expenseDetails.expenseId
        }
        // console.log("delete this comment this.props>>>>>>>>", this.props)
        await this.props.deleteComment(args)
    }

    render() {
        let deleteButton = null;
        if (this.props.loggedInUserId == this.props.commentDetails.AddedByUserId) {
            deleteButton = (
                <FaTimes
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={this.toggleDeleteCommentModal}
                />
            );
        }
        return (
            <div>
                <div className="task">
                    <h6>
                        <strong>
                            {this.props.commentDetails.AddedByUserName}   <span style={{ color: "#8a8f94", fontSize: "12px" }}>
                                <Moment format="MMM DD">{this.props.commentDetails.createdAt}</Moment>
                            </span>
                        </strong>
                                    {deleteButton}
                    </h6>
                    <p>{this.props.commentDetails.description}</p>
                    <hr />
                </div>
                <Modal style={customStyles} isOpen={this.state.deleteCommentPopUp} ariaHideApp={false}>
                        <ConfirmDeleteComment data={this.props} deleteThisComment={this.deleteThisComment} closePopUp={this.toggleDeleteCommentModal} />
                </Modal>
            </div>
        );
    }


}

export default Comments;

