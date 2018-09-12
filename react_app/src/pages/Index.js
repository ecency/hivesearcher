import React, {Component} from 'react';
import logo from '../logo.png';
import Button  from 'antd/lib/button';

export default  class Index extends Component {
    componentDidMount() {
        document.querySelector('#txt-search').focus();
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

        return (
            <div className="index-page">
                <div className="index-page-content">
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
                        <input type="text" id="txt-search" maxLength={100} onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                this.submit()
                            }
                        }} placeholder="How to become a millionaire with Steem"/>
                    </div>
                    <Button type="primary" onClick={e => this.submit()}>Search</Button>
                </div>
            </div>
        );
    }
}
