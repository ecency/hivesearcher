/* eslint-disable */
import linkify from './linkify';

describe('Linkify', () => {
    it('(1) ', () => {
        expect(linkify("foo", "fancy-post-title-001")).toMatchSnapshot();
    });

});