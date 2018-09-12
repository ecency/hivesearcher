import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {parseQuery} from '../util'
import logo from '../logo.png';
import Button  from 'antd/lib/button';
import message from 'antd/lib/message';
import {API_URL} from '../config';
import LinearProgress from '../components/LinearProgress'
import axios from 'axios';

export default class Search extends Component {
    constructor(props) {
        super(props);

        const {location, history} = props;

        const qs = parseQuery(location.search);
        if (qs.q === undefined || qs.q.trim() === '') {
            history.push(`/`);
            return;
        }

        this.state = {query: qs.q, fetching: false, scroll_id: null, data: []};
    }

    componentDidMount() {
       console.log("Mount")
    }

    componentDidUpdate(){
        console.log("Update")
    }

    fetchData() {

        const {query} = this.state;

        const formData = new FormData();
        formData.set('q', query);

        this.setState({fetching: true});

        axios({
            method: 'post',
            url: `${API_URL}api/search`,
            data: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        }).then(function (resp) {
            console.log(resp.data)

        }).catch(function (resp) {
            message.error('An error has occurred');
        }).then(() => {
            this.setState({fetching: false});
        })
    }

    submit() {
        const q = document.querySelector('#txt-search').value.trim();
        if (q === '') {
            document.querySelector('#txt-search').focus();
            return;
        }
        const {history} = this.props;
        history.push(`/search?q=${q}`);

        this.setState({query: q, fetching: false, scroll_id: null, data: []});
        this.fetchData()
    }

    render() {
        const {location} = this.props;
        const qs = parseQuery(location.search);

        const {fetching, query} = this.state;


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
                            }} defaultValue={qs.q}/>
                        </div>
                        <div className="submit">
                            <Button type="primary" disabled={fetching} onClick={e => this.submit()}><i className="mi">search</i><strong
                                className="label">Search</strong>
                            </Button>
                        </div>
                    </div>

                    {fetching ? <LinearProgress /> : '' }

                    {query}
                </div>
            </div>
        );
    }
}
