import axios from 'axios';
import {API_URL} from '../config';

export const FETCH_BEGIN = 'count/FETCH_BEGIN';
export const FETCH_OK = 'count/FETCH_OK';
export const FETCH_ERROR = 'count/FETCH_ERROR';

const initialState = {val: 0};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_OK:
            return {
                ...state,
                val: action.payload.val
            };
        default:
            return state;
    }
}

export const fetchCount = () => {
    return (dispatch) => {

        dispatch({
            type: FETCH_BEGIN
        });

        axios({
            method: 'get',
            url: `${API_URL}api/count`
        }).then(function (resp) {

            dispatch({
                type: FETCH_OK,
                payload: {val: resp.data}
            });
        }).catch(function () {
            dispatch({
                type: FETCH_ERROR
            });
        })
    }
};