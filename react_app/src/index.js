import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {ConnectedRouter} from 'connected-react-router'
import store, {history} from './store'
import App from './containers/app'

import './style/antd.css'
import './style/style.css'


render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.querySelector('#root')
)