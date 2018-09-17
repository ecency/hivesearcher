import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Button  from 'antd/lib/button';
import logo from '../../logo.png';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import parseQuery from '../../utils/parse-query'
import {fetchResults} from '../../modules/results'
import ListItem from '../../components/list-item';
import {SORT_CHOICES, DEFAULT_SORT, PAGE_SIZE} from '../../constants';

import LinearProgress from '../../components/linear-progress'

import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {query: '', sort: '', page: 1};
    }

    componentDidMount() {
        const {location, history} = this.props;

        const {q: query, s: sort = DEFAULT_SORT, p: page = 1} = parseQuery(location.search);

        if (query === undefined || query.trim() === '') {
            history.push(`/`);
            return;
        }

        if (sort && !SORT_CHOICES.includes(sort)) {
            history.push(`/`);
            return;
        }

        this.setState({query, sort, page: parseInt(page)});

        const {fetchResults} = this.props;
        fetchResults(query, sort, page);
    }

    shouldComponentUpdate() {
        return true;
    }

    componentDidUpdate(prevProps) {
        const {location: prevLocation} = prevProps;
        const {location} = this.props;

        if (prevLocation !== location) {

            const {q: query, s: sort = DEFAULT_SORT, p: page = 1} = parseQuery(location.search);
            this.setState({query, sort, page: parseInt(page)});

            const {fetchResults} = this.props;
            fetchResults(query, sort, page);
        }
    }

    changeSort(sort) {
        const {history} = this.props;
        const {query} = this.state;

        const u = `?q=${query}&s=${sort}`;
        history.push(u);
    }

    changePage(page) {
        const {history} = this.props;
        const {query, sort} = this.state;

        const u = `?q=${query}&s=${sort}&p=${page}`;
        history.push(u);
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
        const {results} = this.props;

        const {query, sort, page} = this.state;

        const group = results.get(query);
        let loading = false;
        let html = [];

        if (group) {
            const hits = group.get('hits');
            const took = group.get('took');
            const pages = group.get('pages');
            const scope = group.getIn(['scopes', `${sort}-${page}`]);
            loading = scope.get('loading');
            const list = scope.get('list');

            if (hits === 0) {
                html.push(<div key="empty" className="no-results"><FormattedMessage id="search.no-result"/></div>)
            }

            if (hits > 0) {
                const resultDetails = (
                    <FormattedHTMLMessage id="search.result-info" values={{hits: hits.toLocaleString(), took}}/>);

                html.push(<div key="info-1" className="result-details">{resultDetails}</div>);

                const sortItems = SORT_CHOICES.map((f) => {
                    return <a key={f} onClick={() => {
                        this.changeSort(f)
                    }} className={`sort-opt ${sort === f ? 'selected' : ''}`}><FormattedMessage
                        id={`search.sort-${f}`}/></a>
                });

                html.push(<div key="tool-box" className={`search-tool-box ${loading ? 'loading' : ''}`}>{sortItems}
                    <div className="result-details">{resultDetails}</div>
                </div>);


                const items = list.map((entry, i) => {
                    return <ListItem key={entry.id} entry={entry}/>
                });

                html.push(<div key="entries" className="entry-list">{items}</div>);

                const pageItems = [...new Array(pages).keys()].map((a) => {
                    const p = (a + 1);
                    return <a onClick={(e) => {
                        this.changePage(p)
                    }} className={`item ${p === page ? 'active' : ''}`} key={`page-${a}`}>{p}</a>
                });

                html.push(<div className="pagination" key="pagination">{pageItems}</div>);

            }

            if (loading) {
                html.push(<LinearProgress key="loading"/>);
            }
        }

        return (
            <div className="search-page">
                <div className="search-page-content">
                    <div className="header">
                        <Link to="/" className="logo">
                            <img src={logo} className="App-logo" alt="logo"/>
                        </Link>
                        <div className="brand">
                            <span>eSteem</span> Search
                        </div>
                        <div className="search-area">
                            <div className="add-on">
                                <i className="mi">search</i>
                            </div>
                            <input type="text" id="txt-search" maxLength={100} onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.submit()
                                }
                            }} defaultValue={query}/>
                        </div>
                        <div className="submit">
                            <Button type="primary" disabled={loading} onClick={e => this.submit()}><i className="mi">search</i><strong
                                className="label"><FormattedMessage id="g.search"/></strong>
                            </Button>
                        </div>
                    </div>
                    {html}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({results}) => ({
    results: results
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchResults
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)