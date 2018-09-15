import {Record, Map, OrderedMap} from 'immutable';
import {LOCATION_CHANGE} from 'connected-react-router';
import parseQuery from '../utils/parse-query';
import resultGroupKey from '../utils/result-group-key.js'
import axios from 'axios';
import {API_URL} from '../config';

export const POSTS_FETCH_BEGIN = 'results/FETCH_BEGIN';
export const POSTS_FETCH_OK = 'results/FETCH_OK';
export const POSTS_FETCH_ERROR = 'result/POSTS_FETCH_ERROR';
export const POSTS_INVALIDATE = 'result/POSTS_INVALIDATE';


export const ResultGroupRecord = Record({
    hits: null,
    took: null,
    scrollId: null,
    err: null,
    loading: true,
    hasMore: true,
    entries: OrderedMap({})
});

const initialState = Map();

export default (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_CHANGE: {
            const {location} = action.payload;
            if (location.pathname === '/search') {
                const groupKey = resultGroupKey(location.search);
                if (state.get(groupKey) === undefined) {
                    return state.set(groupKey, new ResultGroupRecord());
                }
            }
            return state;
        }
        case POSTS_FETCH_BEGIN: {
            const {payload} = action;
            const {groupKey} = payload;
            return state
                .setIn([groupKey, 'err'], null)
                .setIn([groupKey, 'loading'], true);
        }

        case POSTS_FETCH_OK: {
            const {groupKey, data} = action.payload;
            const {results, hits, took, scroll_id: scrollId} = data;

            let newState = state
                .setIn([groupKey, 'hits'], hits)
                .setIn([groupKey, 'took'], took)
                .setIn([groupKey, 'scrollId'], scrollId ? scrollId : null)
                .setIn([groupKey, 'err'], null)
                .setIn([groupKey, 'loading'], false)
                .setIn([groupKey, 'hasMore'], true);

            results.forEach(entry => {
                if (!newState.hasIn([groupKey, 'entries', `${entry.id}`])) {
                    newState = newState.setIn(
                        [groupKey, 'entries', `${entry.id}`],
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

export const fetchResults = (search) => {
    return dispatch => {

        const qs = parseQuery(search);
        const query = qs.q;
        const sort = qs.sort || 'newest';
        const groupKey = resultGroupKey(search);

        dispatch({
            type: POSTS_FETCH_BEGIN,
            payload: {groupKey}
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
                payload: {groupKey, data: resp.data}
            });

        }).catch(function (resp) {

        }).then(() => {

        })
    }
};


export const invalidateResults = () => {
    return dispatch => {
        dispatch({
            type: POSTS_INVALIDATE,
            payload: {}
        });
    }
};