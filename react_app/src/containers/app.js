import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {IntlProvider, addLocaleData} from 'react-intl';
import {flattenMessages} from '../utils/flatten-messages'
import messages from '../locales';

import Home from './home'
import Search from './search'
import About from './about'

import en from 'react-intl/locale-data/en';

addLocaleData([...en]);

export default class App extends Component {
    render() {
        let locale = 'en-US';

        return (
            <IntlProvider locale={locale} messages={flattenMessages(messages[locale])}>
                <div id="wrapper">
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/about" component={About}/>
                </div>
            </IntlProvider>
        );
    }
}
