import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import logo from "../../logo.png";

import Footer from "../../components/footer"

import {injectIntl} from "react-intl";


const searchRequest = `curl https://api.hivesearcher.com/search -d '{"q":"esteem", "sort": "newest"}' -H "Content-Type: application/json" -H "Authorization: YOUR_ACCESS_TOKEN" -X POST`;

const searchResponse = `{
    "took": 0.031,
    "hits": 16687,
    "scroll_id": "DnF1ZXJ5VGhlbkZldGNoBQAAAAAAd77cFmY4TUc4Mlc2VGlxcnBZaFRNZkRlMlEAAAAAAA_TrhZUZVFlbGpfbFJ6aXpxUFdKRkF4dDBnAAAAAAAP068WVGVRZWxqX2xSeml6cVBXSkZBeHQwZwAAAAAAd77dFmY4TUc4Mlc2VGlxcnBZaFRNZkRlMlEAAAAAAHe-2xZmOE1HODJXNlRpcXJwWWhUTWZEZTJR",
    "results": [
        {
            "id": 64697517,
            "author": "esteemapp",
            "permlink": "esteem-search-the-best-app-to-dig-out-steem-content-f19a641976f06est",
            "category": "esteem",
            "children": 29,
            "author_rep": 67.07,
            "title": "Esteem Search - The best app to dig out Steem content",
            "title_marked": "&lt;mark&gt;Marked&lt;/mark&gt; title of the post or comment",
            "body": "Full body text",
            "body_marked": "&lt;mark&gt;Marked&lt;/mark&gt; body of the post or comment",
            "img_url": "https://image.ibb.co/j1zzgL/header.png",
            "payout": 34.876,
            "total_votes": 419,
            "up_votes": 419,
            "created_at": "2018-10-22T06:47:15+00:00",
            "tags": [
                "esteem",
                "steem",
                "steem-dev",
                "esteem-search",
                "search-engine"
            ],
            "app": "esteem/1.1.12-surfer",
            "depth": 0
        },
        ...
    ]
}`;


const stateRequest = `curl https://api.hivesearcher.com/state -H "Authorization: YOUR_ACCESS_TOKEN"`;

const stateResponse = `{
    "request_count": 3,    // request count that made in the day
    "request_limit": 3000  // daily total request limit
}`;


class ApiDocs extends Component {
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
                                <span>Hive</span> searcher / API
                            </div>
                        </div>
                        <div className="api-page-content">
                            <div className="doc-section">
                                <h2>API Key</h2>
                                <Link to="/api-register">GET YOUR API KEY</Link>
                            </div>
                            <div className="doc-section">
                                <h2>Endpoints</h2>
                                <h3>/search [POST]</h3>
                                <h4>Parameters</h4>
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <th>q</th>
                                        <td>Query body</td>
                                    </tr>
                                    <tr>
                                        <th>sort</th>
                                        <td>popularity | newest | relevance <br /> default: relevance</td>
                                    </tr>
                                    <tr>
                                        <th>hide_low</th>
                                        <td>When 1 passed, api skips results which has lower payout value than 0.05 <br /> default: 0</td>
                                    </tr>
                                    <tr>
                                        <th>since</th>
                                        <td>Allows to search result newer than a date. <br /> Datetime in iso format <small>(%Y-%m-%dT%H:%M:%S)</small>. e.g. 2019-09-19T13:11:00 <br /> default: null</td>
                                    </tr>
                                    <tr>
                                        <th>scroll_id</th>
                                        <td>While a search request returns a single "page" of results, the scroll_id can
                                            be
                                            used to retrieve large number of results. You can use current result set's
                                            scroll_id for pagination. Scroll ids are alive for 5 minutes.
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <h4>Example Request</h4>
                                <pre className="code">{searchRequest}</pre>
                                <h4>Example Response</h4>
                                <pre className="code">{searchResponse}</pre>
                                <h3>/state [GET]</h3>
                                <p>Returns usage statistics of the api key.</p>
                                <h4>Example Request </h4>
                                <code className="code">{stateRequest}</code>
                                <h4>Example Response</h4>
                                <pre className="code">{stateResponse}</pre>
                            </div>
                            <hr/>
                            <div className="doc-section">
                                <h2>Query body</h2>
                                <p>A query body can contain tag, author and type filters and allows search combining,
                                    exact
                                    matching and term excluding.</p>
                                <h3>Complex query body example</h3>
                                <code className="code">"desktop app" -"monthly digest" -giveaway author:good-karma
                                    tag:desktop,wallet type:post</code>
                                <p>The query above searchs for posts from @good-karma with two tags together #desktop and
                                    #wallet having exact match of "desktop app" phrase there but excluding posts about
                                    monthly digests or giveaways.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}


export default injectIntl(ApiDocs)
