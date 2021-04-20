import React, { Component } from "react";
import { FaTimes } from "react-icons/fa";
import Moment from 'react-moment'

class Comments extends Component {
    constructor(props) {
        super(props);
        // console.log("PPPPRRRROOOPPPS", this.props);
    }

    render() {
        let deleteButton = null;
        if (this.props.loggedInUserId == this.props.commentDetails.AddedByUserId) {
            deleteButton = (
                <FaTimes
                    style={{ color: "red", cursor: "pointer" }}
                // onClick={() => onDelete(task.id)}
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

