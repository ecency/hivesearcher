import React, {Component} from 'react';
import {parseQuery} from '../util'
import logo from '../logo.png';
import Button  from 'antd/lib/button';
import {API_URL} from '../config';

export default class Search extends Component {

    componentDidMount() {
        const {location, history} = this.props;

        const qs = parseQuery(location.search);
        if (qs.q === undefined || qs.q.trim() === '') {
            history.push(`/`);
        }
    }

    render() {

        console.log(API_URL)

        const {location} = this.props;
        const qs = parseQuery(location.search);

        return (
            <div className="search-page">
                <div className="search-page-content">


                    <div className="header">

                        <div className="logo">
                            <img src={logo} className="App-logo" alt="logo"/>
                        </div>

                        <div className="brand">
                            <span>eSteem</span> Search
                        </div>

                        <div className="search-area">
                            <div className="add-on">
                                <i className="mi">search</i>
                            </div>
                            <input type="text" id="txt-search" onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.submit()
                                }
                            }} defaultValue={qs.q}/>
                        </div>

                        <div className="submit">
                             <Button type="primary">Search</Button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
