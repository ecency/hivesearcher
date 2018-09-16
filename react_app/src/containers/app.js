import React, {Component, Fragment} from "react";
import {Route} from "react-router-dom";
import {addLocaleData, IntlProvider} from "react-intl";
import {flattenMessages} from "../utils/flatten-messages";
import messages from "../locales";
import {version} from "../../package.json";

import Home from "./home";
import Search from "./search";

import en from "react-intl/locale-data/en";

addLocaleData([...en]);

export default class App extends Component {
    render() {
        let locale = 'en-US';

        return (
            <IntlProvider locale={locale} messages={flattenMessages(messages[locale])}>
                <Fragment>
                    <div id="container">
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/search" component={Search}/>
                    </div>
                    <div className="main-footer">
                        <a className="footer-brand" href="https://esteem.app/" target="_blank">eSteem</a>
                        <span className="ver">v{version}</span>
                    </div>
                </Fragment>
            </IntlProvider>
        );
    }
}
