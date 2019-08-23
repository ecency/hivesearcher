import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import logo from "../../logo.png";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import parseQuery from "../../utils/parse-query";
import {fetchResults, invalidateGroup} from "../../modules/results";
import ListItem from "../../components/list-item";
import LinearProgress from "../../components/linear-progress";
import Footer from "../../components/footer"

import {DEFAULT_SORT, SORT_CHOICES} from "../../constants";

import {FormattedHTMLMessage, FormattedMessage, injectIntl} from "react-intl";


class ApiRegister extends Component {
    render() {
        return (
            <Fragment>
                <div className="main-container">
                    <div className="api-page">
                        <div className="header">
                            <Link to="/" className="logo">
                                <img src={logo} className="App-logo" alt="logo"/>
                            </Link>
                            <div className="brand">
                                <span>eSteem</span> Search / Api
                            </div>
                        </div>
                        <div className="api-page-content">


                        </div>
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}


export default injectIntl(ApiRegister)
