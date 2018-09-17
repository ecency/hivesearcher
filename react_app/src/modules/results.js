import {Map, Record} from "immutable";
import axios from "axios";
import {API_URL} from "../config";
import {MAX_PAGES} from "../constants";

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
    scopes: Map({}),
    pages: 0,
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

            // Dont change "took" and "hits" when filters changed
            const realHits = state.getIn([query, 'hits']) || hits;
            const realTook = state.getIn([query, 'took']) || took;

            return state
                .setIn([query, 'hits'], realHits)
                .setIn([query, 'took'], realTook)
                .setIn([query, 'pages'], (pages <= MAX_PAGES ? pages : MAX_PAGES))
                .setIn([query, 'scopes', `${sort}-${page}`, 'loading'], false)
                .setIn([query, 'scopes', `${sort}-${page}`, 'list'], results);
        }
        default:
            return state;
    }
}

export const fetchResults = (query, sort, page = 1) => {
    return (dispatch, getState) => {

        const {results} = getState();

        const group = results.get(query);
        if (group) {
            const scope = group.getIn(['scopes', `${sort}-${page}`]);
            if (scope && scope.get('list').length > 0) {
                return;
            }
        }

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