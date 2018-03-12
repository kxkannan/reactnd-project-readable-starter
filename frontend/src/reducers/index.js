import { combineReducers } from 'redux'

import {
    UP_VOTE_POST,
    DOWN_VOTE_POST,
    EDIT_POST,
    DELETE_POST,
    ADD_POST,
    POST_DETAIL,
    UPDATE_POST,
    ADD_COMMENT,
    UPDATE_COMMENT,
    DELETE_COMMENT,
    UP_VOTE_COMMENT,
    DOWN_VOTE_COMMENT
} from '../actions'


const initialPosts = {
    posts: {
        byId: {},
        allIds: [],
    },
    selectedPostId: null,
    edit: false,
    categories: [],
    comments: []
}

function posts(state = initialPosts, action) {

    switch (action.type) {
        case ADD_POST:
            console.log("action.post: " + JSON.stringify(action.posts))
            let newState = Object.assign({}, state)
            action.posts.map( (post) => {
                newState.posts.byId[post.id] = post
                newState.posts.allIds.push(post.id)
                newState.selectedPostId = state.selectedPostId
                newState.edit = state.edit
                newState.comments = state.comments
                if (!newState.categories.includes(post.category)) {
                    newState.categories.push(post.category)
                }
                console.log("ADD_POST map post: " + JSON.stringify(post) + " action.comment: " + JSON.stringify(action.comment))
                if (newState.posts.byId[post.id].comments &&
                      action.comment &&
                        !newState.posts.byId[post.id].comments.includes(action.comment.id)) {
                    newState.posts.byId[post.id].comments.push(action.comment.id)
                }
                return newState
            })
            return newState

        case UP_VOTE_POST:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.postId]: {...state.byId[action.postId],
                                       voteScore: state.byId[action.postId].voteScore + 1
                                     }
                }
            }

        case DOWN_VOTE_POST:
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.postId]: {...state.byId[action.postId],
                        voteScore: state.byId[action.postId].voteScore - 1
                    }
                }
            }

        case EDIT_POST:
            return {
                ...state,
            }

        case DELETE_POST:
            console.log("DELETE_POST action: " + JSON.stringify(action))
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.postId]: {...state.byId[action.postId],
                                      deleted: true }
                }
            }

        case POST_DETAIL:
            return {
                posts: {...state.posts},
                selectedPostId: action.posts.postId,
                edit: action.posts.edit,
                categories: state.categories,
                comments: state.comments
            }

        case UPDATE_POST:
            console.log("UPDATE_POST state: " + JSON.stringify(state))
            console.log("UPDATE_POST action: " + JSON.stringify(action))
            return {
                posts: {...state.posts,
                      byId: {...state.posts.byId,
                          [action.postId]: {...state.posts.byId[action.postId],
                                             body: action.body}
                      }
                },
                selectedPostId: state.selectedPostId,
                edit: state.edit,
                categories: state.categories,
                comments: state.comments
            }

        case ADD_COMMENT:
            return {
                posts: {...state.posts,
                       byId: {
                           ...state.posts.byId,
                           [action.postId]: {...state.posts.byId[action.postId],
                                             comments: state.posts.byId[action.postId].comments.concat([action.comment.id])
                                            }
                       }
                },
                selectedPostId: state.selectedPostId,
                edit: state.edit,
                categories: state.categories,
                comments: {...state.comments,
                           byId: {
                               ...state.comments.byId,
                               [action.comment.id]: action.comment
                           }
                }
            }

        case UPDATE_COMMENT:
            return {
               ...state,
               comments: {...state.comments,
                          byId: {
                              ...state.comments.byId,
                              [action.commentId]: {...state.comments.byId[action.commentId],
                                                   comment: action.updatedComment}
                          }}
            }

        case DELETE_COMMENT:
            let newComments =  {}
            Object.keys(state.comments.byId).filter( (commentId) => {
                if ( commentId != action.commentId ) {
                    newComments[commentId] = state.comments.byId[commentId]
                }
            })

            let newCommentIds = state.posts.byId[action.postId].comments.filter ( commentId => commentId != action.commentId )

            return {
                ...state,
                comments: { ...state.comments,
                            byId: newComments,
                          },
                posts: {
                    ...state.posts,
                    byId: {
                        ...state.posts.byId,
                        [action.postId]: {
                                            ...state.posts.byId[action.postId],
                                            comments: newCommentIds
                                         }
                    }
                }
            }

        case UP_VOTE_COMMENT:
            console.log("UP_VOTE_COMMENT action: " + JSON.stringify(action))
            console.log("UP_VOTE_COMMENT state comments: " + JSON.stringify(state.comments))
            console.log("state.comments.byId[" + action.commentId + " " + JSON.stringify(state.comments.byId[action.commentId]))
            return {
                ...state,
                comments: {...state.comments,
                            byId: {
                                ...state.comments.byId,
                                [action.commentId]: {...state.comments.byId[action.commentId],
                                                      voteScore: state.comments.byId[action.commentId].voteScore + 1
                                                    }
                            }}
            }

        case DOWN_VOTE_COMMENT:
            return {
                ...state,
                comments: {...state.comments,
                    byId: {
                        ...state.comments.byId,
                        [action.commentId]: {...state.comments.byId[action.commentId],
                            voteScore: state.comments.byId[action.commentId].voteScore - 1
                        }
                    }}
            }



        default:
            return state;
    }

}


export default combineReducers({
    posts
})