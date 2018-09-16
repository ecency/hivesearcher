import {Record, Map, OrderedMap} from 'immutable';
import parseQuery from '../utils/parse-query';
import resultGroupKey from '../utils/result-group-key.js'
import axios from 'axios';
import {API_URL} from '../config';
import {SORT_CHOICES, PAGE_SIZE} from '../constants';

export const POSTS_FETCH_BEGIN = 'results/FETCH_BEGIN';
export const POSTS_FETCH_OK = 'results/FETCH_OK';
export const POSTS_FETCH_ERROR = 'result/POSTS_FETCH_ERROR';
export const POSTS_INVALIDATE = 'result/POSTS_INVALIDATE';


export const ResultGroupRecord = Record({
    hits: null,
    took: null,
    entries: Map({
        popularity: Map({
            scrollId: null,
            hasMore: true,
            loading: true,
            list: OrderedMap({})
        }),
        relevance: Map({
            scrollId: null,
            hasMore: true,
            loading: true,
            list: OrderedMap({})
        }),
        newest: Map({
            scrollId: null,
            hasMore: true,
            loading: true,
            list: OrderedMap({})
        })
    })
});


const initialState = Map();

export default (state = initialState, action) => {
    switch (action.type) {
        case POSTS_FETCH_BEGIN: {
            const {payload} = action;
            const {groupKey, sort} = payload;

            if (state.get(groupKey) === undefined) {
                return state.set(groupKey, new ResultGroupRecord());
            }

            return state.setIn([groupKey, 'entries', sort, 'loading'], true);
        }

        case POSTS_FETCH_OK: {
            const {groupKey, sort, data} = action.payload;
            const {results, hits, took, scroll_id: scrollId} = data;

            const realHits = state.getIn([groupKey, 'hits']) || hits;
            const realTook = state.getIn([groupKey, 'took']) || took;

            let newState = state
                .setIn([groupKey, 'hits'], realHits)
                .setIn([groupKey, 'took'], realTook)
                .setIn([groupKey, 'entries', sort, 'loading'], false)
                .setIn([groupKey, 'entries', sort, 'scrollId'], scrollId ? scrollId : null)
                .setIn([groupKey, 'entries', sort, 'hasMore'], (results.length === PAGE_SIZE));

            results.forEach(entry => {
                if (!newState.hasIn([groupKey, 'entries', sort, 'list', `${entry.id}`])) {
                    newState = newState.setIn(
                        [groupKey, 'entries', sort, 'list', `${entry.id}`],
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

export const fetchResults = (query, sort, fetchMore) => {
    return (dispatch, getState) => {

        const groupKey = resultGroupKey(query);

        const {results} = getState();


        if (!fetchMore && results.get(groupKey) && results.getIn([groupKey, 'entries', sort, 'list']).size > 0) {
            return;
        }

        dispatch({
            type: POSTS_FETCH_BEGIN,
            payload: {groupKey, sort}
        });

        const formData = new FormData();
        formData.set('q', query);
        formData.set('sort', sort);

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
                payload: {groupKey, sort, data: resp.data}
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