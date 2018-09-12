import {Record, Map, OrderedMap} from 'immutable';
import {LOCATION_CHANGE} from 'connected-react-router';

export const POST_FETCH_BEGIN = 'result/FETCH_BEGIN';
export const POST_FETCH_OK = 'result/FETCH_BEGIN';
export const POSTS_FETCH_ERROR = 'result/POSTS_FETCH_ERROR';
export const POSTS_INVALIDATE = 'result/POSTS_INVALIDATE';


export const ResultGroupRecord = Record({
    entries: OrderedMap({}),
    err: null,
    loading: false,
    hasMore: true
});

const initialState = Map();

export default (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            return state;
        default:
            return state;
    }
}

export const fetchPosts = () => {
    return dispatch => {
        dispatch({
            type: POST_FETCH_BEGIN,
            payload: {}
        });
    }
};