import {Record, Map, OrderedMap, List} from 'immutable';
import parseQuery from '../utils/parse-query';
import resultGroupKey from '../utils/result-group-key.js'
import axios from 'axios';
import {API_URL} from '../config';
import {SORT_CHOICES, PAGE_SIZE, MAX_PAGES} from '../constants';
import md5 from 'blueimp-md5'

export const POSTS_FETCH_BEGIN = 'results/FETCH_BEGIN';
export const POSTS_FETCH_OK = 'results/FETCH_OK';
export const POSTS_FETCH_ERROR = 'result/POSTS_FETCH_ERROR';
export const POSTS_INVALIDATE = 'result/POSTS_INVALIDATE';


export const FilterPageRecord = Record({
    loading: true,
    list: []
});

export const ResultGroupRecord = Record({
    hits: null,
    took: null,
    scopes: Map({}), // queryHash-filter-page
    pages: 0, // queryHash-filter
});

const initialState = Map();

export default (state = initialState, action) => {
    switch (action.type) {
        case POSTS_FETCH_BEGIN: {
            const {payload} = action;
            const {query, sort, page} = payload;

            if (state.get(query) === undefined) {
                let newState = state.set(query, new ResultGroupRecord());
                newState = newState.setIn([query, 'scopes', `${sort}-${page}`], FilterPageRecord());
                return newState
            }

            return state.setIn([query, 'scopes', `${sort}-${page}`], FilterPageRecord());
        }

        case POSTS_FETCH_OK: {
            const {query, sort, page, data} = action.payload;
            const {results, hits, took, pages} = data;

            return state
                .setIn([query, 'hits'], hits)
                .setIn([query, 'took'], took)
                .setIn([query, 'pages'], (pages <= MAX_PAGES ? pages : MAX_PAGES))
                .setIn([query, 'scopes', `${sort}-${page}`, 'loading'], false)
                .setIn([query, 'scopes', `${sort}-${page}`, 'list'], results);


            /*
             if (pages > MAX_PAGES) pages = MAX_PAGES;


             const realHits = state.getIn([groupKey, 'hits']) || hits;
             const realTook = state.getIn([groupKey, 'took']) || took;

             let newState = state
             .setIn([groupKey, 'hits'], realHits)
             .setIn([groupKey, 'took'], realTook)
             .setIn([groupKey, 'entries', sort, 'pages'], pages)
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

             return newState;*/
        }
        default:
            return state;
    }
}

export const fetchResults = (query, sort, page = 1) => {
    return (dispatch, getState) => {

        const groupKey = resultGroupKey(query);


        /*
         const {results} = getState();

         if (!scrollId && results.get(groupKey) && results.getIn([groupKey, 'entries', sort, 'list']).size > 0) {
         return;
         }*/

        dispatch({
            type: POSTS_FETCH_BEGIN,
            payload: {query, sort, page}
        });

        const formData = new FormData();
        formData.set('q', query);
        formData.set('so', sort);
        formData.set('pa', page);

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
                payload: {query, sort, page, data: resp.data}
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