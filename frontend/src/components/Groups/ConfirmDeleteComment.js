import React, { Component } from 'react';

class ConfirmDeleteComment extends Component {
    constructor(props) {
        super(props);
    }
 
    render() {
        return (
            <div class="container">
                <div class="row">
                    <div class="col-11">
                        <h3><strong>Confirm Delete?</strong></h3>
                        <hr></hr>
                    </div>
                    <div class="col-1" style={{ textAlign: "right" }}>
                        <button class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.props.closePopUp}><i class="fa fa-times button"></i></button>
                    </div>
                </div>
                <div class="row">
                    <button class="btn btn-primary" style={{ marginBottom: "10px", backgroundColor: "#ed752f", border: "none" }} onClick={this.props.deleteThisComment}><strong>Delete</strong></button>
                    <button class="btn btn-primary" style={{ backgroundColor: "#59cfa7", border: "none" }} onClick={this.props.closePopUp}><strong>Cancel</strong></button>
                </div>
            </div>
        )
    }
}
export default ConfirmDeleteComment;

