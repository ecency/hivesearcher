import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, it, expect } from 'vitest';
import store from './store';
import App from './containers/app';

afterEach(cleanup);

// Smoke test: mounts the whole app and confirms the Home screen renders. This
// exercises the rewired plumbing — redux Provider, react-router v6 (+ the
// withRouter shim), react-intl v6 IntlProvider / injectIntl, and the
// FormattedMessage/FormattedHTMLMessage shims — not just that it compiles.
it('renders the home screen without crashing', () => {
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        </Provider>
    );

    expect(document.querySelector('#txt-search')).toBeTruthy();
});
