import { Remarkable } from 'remarkable';
import he from 'he';

// linkify defaults to off in remarkable v2 (the constructor option was removed).
const md = new Remarkable({html: true, breaks: true});

export default (input, length) => {
    if (!input) {
        return '';
    }

    // Convert markdown to html
    let text = md.render(input);

    text = text
        .replace(/_{1,}([ a-z0-9]+)_{1,}/img, '$1') // remove markdown
        .replace(/(<\/?(?:mark)[^>]*>)|<[^>]+>/img, '$1') // Remove all html tags but not <mark>
        .replace(/\r?\n|\r/g, ' ') // Remove new lines
        .trim()
        .replace(/ +(?= )/g, ''); // Remove all multiple spaces

    if (length) {
        // Truncate
        text = text.substring(0, length);
    }

    text = he.decode(text); // decode html entities

    return text;
};
