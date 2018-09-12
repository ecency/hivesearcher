import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {parseQuery} from '../util'
import logo from '../logo.png';
import Button  from 'antd/lib/button';
import {API_URL} from '../config';
import LinearProgress from '../components/LinearProgress'

export default class Search extends Component {

    componentDidMount() {
        const {location, history} = this.props;

        const qs = parseQuery(location.search);
        if (qs.q === undefined || qs.q.trim() === '') {
            history.push(`/`);
        }
    }

    render() {
        const {location} = this.props;
        const qs = parseQuery(location.search);

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
                            <Button type="primary"><i className="mi">search</i><strong className="label">Search</strong> </Button>
                        </div>
                    </div>

                     <LinearProgress />
                </div>
            </div>
        );
    }
}
