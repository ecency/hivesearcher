/* eslint-disable */
import {Map, Record} from "immutable";

import {POSTS_FETCH_BEGIN} from './results'
import results from './results';

describe('Results', () => {
    it('(1) ', () => {

        let query = 'esteem type:post author:good-karma';
        let sort = 'popularity';
        let page = 1;

        let action = {
            type: POSTS_FETCH_BEGIN,
            payload: {query, sort, page}
        };

        let state = Map();

        let new_state = results(state, action);



        query = 'esteem type:post author:good-karma';
        sort = 'newest';
        page = 1;


        action = {
            type: POSTS_FETCH_BEGIN,
            payload: {query, sort, page}
        };


        let new_state2 = results(new_state, action);
        console.group(JSON.stringify(new_state2, 0, 2))


    });

});