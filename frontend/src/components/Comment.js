import React, {Component} from 'react'
import {connect} from 'react-redux'
import { addComment }  from '../actions'

class Comment extends Component {

    constructor(props){
        super(props)
        this.state = {
            comment: "",
            author: ""
        }

        this.addComment   = this.addComment.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    generateId = () => {
        let id = ""
        let possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

        for (let i=0; i < 22; i++)
            id += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

        return id;
    }

    addComment = (event) => {
        event.preventDefault();
        console.log("comment addComment: " + this.props.postId + " comment: " + this.state.comment + " author: " + this.state.author)
        let newComment = {
            id: this.generateId(),
            comment: this.state.comment,
            author: this.state.author,
            timestamp: Date.now(),
            voteScore: 0
        }
        this.props.addComment({ postId: this.props.postId, comment: newComment })
        this.setState({comment: "", author: ""})
    }

    handleChange = (event) => {
        this.setState({comment: event.target.value})
    }

    handleAuthorChange = (event) =>  {
        this.setState({author: event.target.value})
    }

    render() {
        const { postId  } = this.props
        const { comment, author } = this.state

        return (
            <tr className="newComment">
                <td>
                    <form onSubmit={this.addComment}>
                      <div className="newComment">
                            <textarea className="newCommentTextArea" value={comment} onChange={this.handleChange}></textarea>
                      </div>
                      <div className="newCommentAuthor">
                        <span>
                          <label>Author: </label>
                          <input name="comment" className="commentInput"  value={author} onChange={this.handleAuthorChange} />
                          <button className="newCommentSubmit" onClick={this.addComment}>Add Comment</button>
                        </span>
                      </div>
                    </form>
                </td>
            </tr>
        )
    }

}

function mapStateToProps(state) {
    return {
        comments: state.comments
    }

}

function mapDispatchToProps(dispatch){
    return {
        addComment: (data) => dispatch(addComment(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)