import React from 'react';
import { useIntl } from 'react-intl';

// react-intl v3+ removed FormattedHTMLMessage. Our locale strings embed HTML
// (e.g. <span class="count">{n}</span>), so format the message with tag parsing
// disabled and render the result as HTML — matching the old behaviour.
export function FormattedHTMLMessage({ id, values, tagName: Tag = 'span', ...rest }) {
    const intl = useIntl();
    const __html = intl.formatMessage({ id }, values, { ignoreTag: true });
    return <Tag {...rest} dangerouslySetInnerHTML={{ __html }} />;
}

// Picks the largest time unit whose magnitude the delta has reached, mirroring
// the auto-unit behaviour of the old <FormattedRelative/>.
const UNITS = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 30],
    ['month', 12],
    ['year', Infinity],
];

// react-intl v3+ replaced FormattedRelative (took a date) with
// FormattedRelativeTime (takes value + unit). This shim keeps the date-in API.
export function FormattedRelative({ value }) {
    const intl = useIntl();

    let delta = (new Date(value).getTime() - Date.now()) / 1000; // seconds; negative = past
    let unit = 'second';
    for (const [u, span] of UNITS) {
        unit = u;
        if (Math.abs(delta) < span) break;
        delta /= span;
    }

    return <>{intl.formatRelativeTime(Math.round(delta), unit, { numeric: 'auto' })}</>;
}
