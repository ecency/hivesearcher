/* eslint-disable */
import parseQuery from './parse-query';

describe('Parse Query', () => {
    it('(1) Empty string', () => {
        let input = '';
        expect(parseQuery(input)).toMatchSnapshot();
    });

    it('(2) With single parameter ', () => {
        let input = '?q=foo';
        expect(parseQuery(input)).toMatchSnapshot();
    });

    it('(3) With multiple parameter ', () => {
        let input = '?q=foo&sort=best';
        expect(parseQuery(input)).toMatchSnapshot();
    });
});