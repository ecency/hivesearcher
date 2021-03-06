import React, {Component, Fragment} from 'react';
import Icon from '../../components/icon';
import logo from '../../logo.png';

import {fetchCount} from '../../modules/count'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl';

import Footer from "../../components/footer"

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {countChanged: false, intervalId: null, timeOutId: null};
    }

    componentDidMount() {

        document.querySelector('#txt-search').focus();

        const {fetchCount} = this.props;

        fetchCount();

        const intervalId = setInterval(() => {
            fetchCount();
        }, 3000);

        this.setState({intervalId: intervalId});
    }

    componentDidUpdate(prevProps) {
        const {count: oldCount} = prevProps;
        const {count} = this.props;

        if (count !== oldCount) {
            this.setState({countChanged: true});

            const timeOutId = setTimeout(() => {
                this.setState({countChanged: false});
            }, 1000);

            this.setState({timeOutId: timeOutId});
        }
    }

    componentWillUnmount() {
        const {intervalId, timeOutId} = this.state;
        clearInterval(intervalId);
        clearTimeout(timeOutId);
    }

    submit() {
        const q = document.querySelector('#txt-search').value.trim();
        if (q === '') {
            document.querySelector('#txt-search').focus();
            return;
        }
        const {history} = this.props;
        history.push(`/search?q=${q}`);
    }

    render() {
        const {count, intl} = this.props;
        const {countChanged} = this.state;

        return (
            <Fragment>
                <div className="main-container">
                    <div className="home-page">
                        <div className="index-page-content">
                            <div className="logo">
                                <img src={logo} alt="Hivesearcher"/>
                            </div>
                            <div className="brand">
                                <span>Hive</span> searcher
                            </div>
                            <div className="search-area">
                                <div className="add-on">
                                    <Icon icon="search"/>
                                </div>
                                <input type="text" id="txt-search" maxLength={100} autoCorrect="off"
                                       autoCapitalize="none"
                                       onKeyPress={(e) => {
                                           if (e.key === 'Enter') {
                                               this.submit()
                                           }
                                       }} placeholder={intl.formatMessage({id: "home.search-placeholder"})}/>
                                <a href="https://ecency.com/esteem/@esteemapp/esteem-search-tips-c42f5a640930best"
                                   target="_blank" rel="noopener noreferrer" className="search-tip"
                                   title={intl.formatMessage({id: "home.search-tips"})}>
                                    <Icon icon="info"/>
                                </a>
                            </div>
                            <div className="form-submit">
                                <button className="big-button" type="button" onClick={e => this.submit()}>
                                    <FormattedMessage
                                        id="g.search"/></button>
                            </div>
                            <div className={`indexed-count ${count ? 'visible' : ''} ${countChanged ? 'changed' : ''}`}>
                                <FormattedHTMLMessage id="home.n-documents-indexed"
                                                      values={{n: count.toLocaleString()}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </Fragment>
        )
    }
}

const mapStateToProps = ({count}) => ({
    count: count.val
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchCount
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(Home))