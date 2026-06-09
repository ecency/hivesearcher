import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { flattenMessages } from "../utils/flatten-messages";
import messages from "../locales";

import Home from "./home";
import Search from "./search";
import SearchIframe from "./search-iframe";
import ApiDocs from './api/docs';
import ApiRegister from './api/register';

export default class App extends Component {
    render() {
        const locale = 'en-US';

        return (
            <IntlProvider locale={locale} defaultLocale="en-US" messages={flattenMessages(messages[locale])}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/search-iframe" element={<SearchIframe />} />
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/api-register" element={<ApiRegister />} />
                </Routes>
            </IntlProvider>
        );
    }
}
