import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Button  from 'antd/lib/button';
import Icon from '../../components/icon'
import logo from '../../logo.png';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {parseQuery} from '../../util'
import {fetchPosts} from '../../modules/results'

import LinearProgress from '../../components/linear-progress'

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {text: ''}
    }

    componentDidMount() {

        const {location, history} = this.props;

        const qs = parseQuery(location.search);
        if (qs.q === undefined || qs.q.trim() === '') {
            history.push(`/`);
            return;
        }

        this.setState({text: qs.q});

        const {fetchPosts} = this.props;
        fetchPosts(qs.q);
    }

    componentDidUpdate(prevProps) {
        const {location: prevLocation} = prevProps;
        const {location} = this.props;

        if (prevLocation !== location) {
            const qs = parseQuery(location.search);
            this.setState({text: qs.q});

            const {fetchPosts} = this.props;
            fetchPosts(qs.q);
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

    onChange(e) {
        const newText = e.target.value;
        this.setState({text: newText});
    }


    render() {


        const {location, results} = this.props;
        const qs = parseQuery(location.search);
        const query = qs.q;

        const result = results.get(query);
        const posts = result.get('posts');
        const loading = result.get('loading');

        console.log(loading)

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
                            }} value={this.state.text} onChange={(e) => {
                                this.onChange(e)
                            }}/>
                        </div>
                        <div className="submit">
                            <Button type="primary" disabled={loading} onClick={e => this.submit()}><i className="mi">search</i><strong
                                className="label">Search</strong>
                            </Button>
                        </div>
                    </div>

                    {loading ? <LinearProgress /> : '' }


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
            fetchPosts
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)