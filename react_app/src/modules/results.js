import {Record, Map, OrderedMap} from 'immutable';
import {LOCATION_CHANGE} from 'connected-react-router';
import {parseQuery} from '../util';
import axios from 'axios';
import {API_URL} from '../config';

export const POSTS_FETCH_BEGIN = 'results/FETCH_BEGIN';
export const POSTS_FETCH_OK = 'results/FETCH_OK';
export const POSTS_FETCH_ERROR = 'result/POSTS_FETCH_ERROR';
export const POSTS_INVALIDATE = 'result/POSTS_INVALIDATE';


export const ResultGroupRecord = Record({
    posts: Map({
        hits: null,
        took: null,
        scrollId: null,
        sort: null,
        err: null,
        loading: false,
        hasMore: true,
        entries: OrderedMap({})
    }),
    comments: Map({
        hits: null,
        took: null,
        scrollId: null,
        sort: null,
        err: null,
        loading: false,
        hasMore: true,
        entries: OrderedMap({})
    }),
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
            const {query} = payload;
            return state
                .setIn([query, 'posts', 'err'], null)
                .setIn([query, 'posts', 'loading'], true);
        }

        case POSTS_FETCH_OK: {
            const {query, sort, data} = action.payload;
            const {results, hits, took, scroll_id: scrollId} = data;

            let newState = state
                .setIn([query, 'posts', 'hits'], hits)
                .setIn([query, 'posts', 'took'], took)
                .setIn([query, 'posts', 'scrollId'], scrollId)
                .setIn([query, 'posts', 'sort'], sort)
                .setIn([query, 'posts', 'err'], null)
                .setIn([query, 'posts', 'loading'], false)
                .setIn([query, 'posts', 'hasMore'], true);

            results.forEach(entry => {
                if (!newState.hasIn([query, 'posts', 'entries', `${entry.id}`])) {
                    newState = newState.setIn(
                        [query, 'posts', 'entries', `${entry.id}`],
                        entry
                    );
                }
            });

            return newState;
        }


        default:
            return state;
    }
}

export const fetchPosts = (query, sort) => {
    return dispatch => {

        dispatch({
            type: POSTS_FETCH_BEGIN,
            payload: {query}
        });


        const formData = new FormData();
        formData.set('q', query);

        axios({
            method: 'post',
            url: `${API_URL}api/search`,
            data: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        }).then(function (resp) {

            dispatch({
                type: POSTS_FETCH_OK,
                payload: {query, sort, data: resp.data}
            });

        }).catch(function (resp) {

        }).then(() => {

        })


    }
};