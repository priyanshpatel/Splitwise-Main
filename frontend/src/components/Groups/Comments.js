import React, { Component } from "react";
import { FaTimes } from "react-icons/fa";
import Moment from 'react-moment'

class Comments extends Component {
    constructor(props) {
        super(props);
        // console.log("PPPPRRRROOOPPPS", this.props);
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
                    onClick={this.deleteThisComment}
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
            </div>
        );
    }


}

export default Comments;

