/* eslint-disable */
import markedHtml from './marked-html';

describe('Marked Html', () => {
    it('(1) Remove all html but not <mark>', () => {
        let input = '<strong>lorem</strong> ipsum dolor sit <mark>amet</mark>';
        expect(markedHtml(input)).toMatchSnapshot();
    });

    it('(2) Should trim and remove multiple spaces', () => {
        let input = 'Etiam iaculis quis diam nec elementum.         Nulla vel facilisis massa.     Sed eu.        ';
        expect(markedHtml(input)).toMatchSnapshot();
    });

    it('(3) Should truncate', () => {
        let input = 'Etiam iaculis quis diam nec elementum.';
        expect(markedHtml(input, 10)).toMatchSnapshot();
    });

    it('(4) Should remove markdown', () => {
        let input = "# Lorem **ipsum** dolor sit amet, consectetur adipiscing elit. Quisque [hendrerit](http://google.com) vulputate ligula, id interdum metus volutpat id. <code>Vivamus</code> eget _congue_ nisi, at mollis ante.";
        expect(markedHtml(input)).toMatchSnapshot();
    });
});