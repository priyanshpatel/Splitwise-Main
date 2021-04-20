import React, { Component } from 'react';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';

class NewComments extends Component {
    constructor(props) {
        super(props);
        console.log("NEEEEEWWWWWWWWWWW",this.props)

        this.state = {
            expenseId: this.props.expenseDetails.expenseId,
            comment: null
        }
    }

    commentChangeHandler = (e) => {
        console.log("-------inside comment change handler of newcomments--------", e.target.value)
        this.setState({
            comment: e.target.value
        })
    }

    addNewComment = async (e) => {
        e.preventDefault()
        let args = {
            expenseId: this.state.expenseId,
            commentDescription: this.state.comment
        }
        await this.props.addComment(args)
        this.setState({
            comment: ""
        })
    }

    render() {
        return (
                <form>
                    <div class="row" >
                        <div class="col-9">
                            <div class="row">
                                <div class="col-5">
                                    <span style={{ paddingLeft: "15px" }}><strong>Add a comment:</strong></span>
                                    {/* <div class="mb-3">
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" style={{ fontSize: "1.2em", width: "700px" }}></textarea>
                            </div> */}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-5">
                                    <div class="mb-3" style={{ paddingLeft: "15px" }} >
                                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="2" value={this.state.comment} onChange={this.commentChangeHandler} style={{ fontSize: "1.2em", width: "500px" }} required ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-2">
                                    {/* <button>Post</button> */}
                                    <div style={{ paddingLeft: "15px" }}>
                                        <button class="btn btn-primary" type="submit" onClick={this.addNewComment} style={{ backgroundColor: "#ed752f", border: "none" }}><strong>Post</strong></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
        )
    }
}
export default NewComments;
