import axios from 'axios';
import {API_URL} from '../config';

export const FETCH_BEGIN = 'count/FETCH_BEGIN';
export const FETCH_OK = 'count/FETCH_OK';
export const FETCH_ERROR = 'count/FETCH_ERROR';

const initialState = {val: 0, changed: false};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_OK:
            return {
                ...state,
                val: action.payload.val,
                changed: action.payload.changed
            };
        default:
            return state;
    }
}

export const fetchCount = () => {
    return (dispatch, getState) => {

        const state = getState();
        const {count} = state;


        dispatch({
            type: FETCH_BEGIN
        });

        axios({
            method: 'get',
            url: `${API_URL}api/count`
        }).then(function (resp) {
            const newVal = resp.data;
            const changed = count.val !== newVal;

            dispatch({
                type: FETCH_OK,
                payload: {val: resp.data, changed: changed}
            });
        }).catch(function () {
            dispatch({
                type: FETCH_ERROR
            });
        })
    }
};