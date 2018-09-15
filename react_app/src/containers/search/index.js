import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Button  from 'antd/lib/button';
import Icon from '../../components/icon'
import logo from '../../logo.png';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import parseQuery from '../../utils/parse-query'
import {fetchResults} from '../../modules/results'
import resultGroupKey from '../../utils/result-group-key.js'
import ListItem from '../../components/list-item';

import LinearProgress from '../../components/linear-progress'

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {searchText: ''}
    }

    componentDidMount() {
        const {location, history} = this.props;

        const qs = parseQuery(location.search);
        if (qs.q === undefined || qs.q.trim() === '') {
            history.push(`/`);
            return;
        }

        this.setState({searchText: qs.q});

        const {fetchResults} = this.props;
        fetchResults(location.search);
    }

    componentDidUpdate(prevProps) {
        const {location: prevLocation} = prevProps;
        const {location} = this.props;

        if (prevLocation !== location) {
            const qs = parseQuery(location.search);
            this.setState({searchText: qs.q});

            const {fetchResults} = this.props;
            fetchResults(location.search);
        }
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

    searchInputChanged(e) {
        const newText = e.target.value;
        this.setState({searchText: newText});
    }


    render() {
        const {location, results} = this.props;

        const groupKey = resultGroupKey(location.search);

        const posts = results.get(groupKey);
        const entries = posts.get('entries');
        const loading = posts.get('loading');
        const hits = posts.get('hits');
        const took = posts.get('took');
        const sort = posts.get('sort');

        const {searchText} = this.state;


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
                            }} value={searchText} onChange={(e) => {
                                this.searchInputChanged(e)
                            }}/>
                        </div>
                        <div className="submit">
                            <Button type="primary" disabled={loading} onClick={e => this.submit()}><i className="mi">search</i><strong
                                className="label">Search</strong>
                            </Button>
                        </div>
                    </div>

                    {loading ? <LinearProgress /> : '' }

                    {!loading && hits === 0 ? <div className="no-results">Nothing Found</div> : '' }

                    {!loading && hits > 0 &&
                    <div className="result-info">{ hits.toLocaleString() } results in {took} sec</div>
                    }

                    <div className="sort-box">

                        <a className="sort-opt selected">Best</a>
                        <a className="sort-opt">Relevance</a>
                        <a className="sort-opt">Date</a>
                    </div>


                    {entries.valueSeq().map((entry) => {
                        return <ListItem key={entry.id} entry={entry}/>
                    })}

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