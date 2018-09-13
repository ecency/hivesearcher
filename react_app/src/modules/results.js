import {Record, Map, OrderedMap} from 'immutable';
import {LOCATION_CHANGE} from 'connected-react-router';
import {parseQuery} from '../util';


export const POSTS_FETCH_BEGIN = 'result/FETCH_BEGIN';
export const POST_FETCH_OK = 'result/FETCH_BEGIN';
export const POSTS_FETCH_ERROR = 'result/POSTS_FETCH_ERROR';
export const POSTS_INVALIDATE = 'result/POSTS_INVALIDATE';


export const ResultGroupRecord = Record({
    posts: OrderedMap({}),
    comments: OrderedMap({}),
    err: null,
    loading: false,
    hasMore: true
});

const initialState = Map();

export default (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_CHANGE: {
            const {location} = action.payload;
            if (location.pathname === '/search') {
                const qs = parseQuery(location.search);
                const query = qs.q;
                if (state.get(query) === undefined) {
                    return state.set(query, new ResultGroupRecord());
                }
            }
            return state;
        }
        case POSTS_FETCH_BEGIN: {
            const {payload} = action;

            return state
                .setIn([payload.query, 'err'], null)
                .setIn([payload.query, 'loading'], true);
        }


        default:
            return state;
    }
}

export const fetchPosts = (query) => {
    return dispatch => {

        dispatch({
            type: POSTS_FETCH_BEGIN,
            payload: {query}
        });
    }
};