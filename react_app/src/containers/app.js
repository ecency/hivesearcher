import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {IntlProvider} from 'react-intl';

import Home from './home'
import Search from './search'
import About from './about'


export default class App extends Component {
    render() {
        let locale = 'en-US';

        return (
            <IntlProvider locale={locale}>
                <div id="wrapper">
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/about" component={About}/>
                </div>
            </IntlProvider>
        );
    }
}
