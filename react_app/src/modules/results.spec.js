/* eslint-disable */
import {Map, Record} from "immutable";

import {fetchBegin, fetchOk, fetchError, invalidate} from './results'
import results from './results';

describe('Results', () => {
    it('(1) New group should be created after POSTS_FETCH_BEGIN', () => {

        let query = 'esteem type:post author:good-karma';
        let sort = 'popularity';
        let page = 1;

        let state = Map();

        let new_state = results(state, fetchBegin(query, sort, page));

        expect(new_state).toMatchSnapshot();
    });


    it('(2) Results should be loaded after POSTS_FETCH_OK', () => {

        let query = 'esteem type:post author:good-karma';
        let sort = 'popularity';
        let page = 1;

        let state = Map();

        let new_state = results(state, fetchBegin(query, sort, page));

        let data = {
            "hits": 2,
            "took": "0.012",
            "pages": 1,
            "results": [{"id": 1, "title": "foo"}, {"id": 2, "title": "bar"}]
        };

        let new_state2 = results(new_state, fetchOk(query, sort, page, data));

        expect(new_state2).toMatchSnapshot();
    });

    it('(3) err should be true after POSTS_FETCH_ERROR', () => {

        let query = 'esteem type:post author:good-karma';
        let sort = 'popularity';
        let page = 1;

        let state = Map();

        let new_state = results(state, fetchBegin(query, sort, page));

        let data = {
            "hits": 2,
            "took": "0.012",
            "pages": 1,
            "results": [{"id": 1, "title": "foo"}, {"id": 2, "title": "bar"}]
        };

        let new_state2 = results(new_state, fetchOk(query, sort, page, data));

        page = 2;

        let new_state3 = results(new_state2, fetchError(query, sort, page));

        expect(new_state3).toMatchSnapshot();
    });

    it('(4) err should be false after POSTS_FETCH_BEGIN', () => {

        let query = 'esteem type:post author:good-karma';
        let sort = 'popularity';
        let page = 1;

        let state = Map();

        let new_state = results(state, fetchBegin(query, sort, page));

        let data = {
            "hits": 2,
            "took": "0.012",
            "pages": 1,
            "results": [{"id": 1, "title": "foo"}, {"id": 2, "title": "bar"}]
        };

        let new_state2 = results(new_state, fetchOk(query, sort, page, data));

        page = 2;

        let new_state3 = results(new_state2, fetchError(query, sort, page));

        let new_state4 = results(new_state3, fetchBegin(query, sort, page));

        expect(new_state4).toMatchSnapshot();
    });


    it('(5) Group should be deleted after POSTS_INVALIDATE', () => {

        let query = 'esteem type:post author:good-karma';
        let sort = 'popularity';
        let page = 1;

        let state = Map();

        let new_state = results(state, fetchBegin(query, sort, page));

        query = 'esteem type:post author:good-karma';

        let new_state2 = results(new_state, invalidate(query));

        expect(new_state2).toMatchSnapshot();
    });

});