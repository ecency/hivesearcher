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


const requestUrl = 'curl https://api.search.esteem.app/search -d \'{"q":"esteem", "sort": "newest"}\' -H "Content-Type: application/json" -H "Authorization: YOUR_ACCESS_TOKEN" -X POST ';

const exampleResponse = {
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
            "title": "eSteem Search - The best app to dig out Steem content",
            "title_marked": "<mark>eSteem</mark> <mark>Search</mark> - The best app to dig out Steem content",
            "body": "<div class=\"text-justify\">\n\nWe all use popular Search engines (Google, Bing, Yahoo...) created by the tech giants. In contrast to that, eSteem developed this [Search Engine](https://search.esteem.app) for the Steem Blockchain. \n\n<center><img src=\"https://image.ibb.co/j1zzgL/header.png\" />*Image-Credits: @podanrj*</center>\n\n### What is eSteem Search?\n\n**eSteem Search** is a search engine application built on the Steem blockchain which focuses on Steem content discoveries with awesome embedded features.  It is developed by our eSteem team along with apps like Mobile and Surfer with other Steem apps (SteemFest...).\n\n#### <center>https://search.esteem.app</center>\n\n<center>\n<img src=\"https://cdn.steemitimages.com/DQmUBvPoiSiLeQexqwLubwNKwEacrGHiHpEcbooYiDCtCPD/2018-10-18%2022_51_52-eSteem%20Search%20-%20Opera.png\" />\n*[eSteem Search](https://search.esteem.app) Front-Page*</center>\n\n### Why is eSteem Search better than any Search Engine for Steem content?\n\n- It contains an index of almost all the content on Steem Blockchain, including comments. It will continue to index updated and incoming content, you can watch it live on website.\n- No Ads.\n- No Captcha.\n- It's decentralized, data is untampered and unsencored purely coming from blockchain\n- It does not store users' logs.\n- It's all about Steem content.\n\n### TIPS\n\n### <center>Finding content or duplicated content/posts easily</center>\nMost people who search for abusers (plagiarism, duplicated posts by the same or different authors) use the Google search engine and other search engines. \n\nThough Google Search Engine may be the best to search for plagiarism posts and find their original sources for content outside Steem, it is poor when it is used to search for Steem content on the Steem blockchain. \n\nIf you paste a Steem content article in Google search, either to see the original link or to find out if the content has been duplicated, Google won't provide the result because it has a low index for Steem content. This is why [eSteem search](https://search.esteem.app) is better to filter any Steem content. \n\n#### <center>\"[eSteem search](https://search.esteem.app) is the best to filter through Steem content\"</center>\n<p>\n\n**With [eSteem search](https://search.esteem.app) app;**\n- You find related result to your 'search text/keyword' on Steem.\n- You can easily find out if content is duplicated.\n\n#### <center>\"[eSteem search](https://search.esteem.app) incorporates  all Steem blockchain content, posts and comments!\"</center>\n![eSteem Footer Line](https://img.esteem.ws/6uq66a9wam.png)\n### <center>Demonstration [Searching for content and duplicated post]</center>\n**The following results compare the use of Google with the use of eSteem Search for Steem content.**\nSearch keyword: `\"horpey birthday on Steem\"`\n\n|    <center>Google Search Result</center>         |    <center>eSteem Search Result</center>         |    \n|    ------------    |    ------------    |    \n| ![yi50y91px5.png](https://img.esteem.ws/yi50y91px5.png)  |  ![9yk8n0w0na.png](https://img.esteem.ws/9yk8n0w0na.png) |       \n|         <center>★★</center>         |     <center>★★★★★</center>             |    \n\n**The following results compare the use of Google with the use of eSteem Search for Steem duplicated content.**\nSearch keyword: `\"Just right beneath the heart It's a thing that can never be specified However destination comes into it when you happen to be smart The development of your body, mind and spirit Depend on the solid training ground you create in it\"`\n\n|    <center>Google Search Result</center>         |    <center>eSteem Search Result</center>         |    \n|    ------------    |    ------------    |    \n| ![bq28q33ne4.png](https://img.esteem.ws/bq28q33ne4.png)                | ![6m0c9eryp9.png](https://img.esteem.ws/6m0c9eryp9.png)              |       \n|         <center>★★ </center>        |     <center>★★★★★</center>             |    \n\n![steemit-border](https://img.esteem.ws/av4tt0mlsg.png) \n***eSteem search app** is still in alpha version. Stay tuned as more features are implemented.* \n</div>\n\n![eSteem Footer Line](https://img.esteem.ws/6uq66a9wam.png)\n\n| iOS | Android |\n| --- | --- |\n| [![Get eSteem on AppStore](https://cdn.steemitimages.com/DQmQAR7LMXwzn6RSYUvkquVLLnioQabdA32FvXCPgjHcttC/apple.png)](https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1141397898&mt=8 \"This link will take you away from esteem\") | [![Get eSteem on Google Play](https://cdn.steemitimages.com/DQmai7aLAT2MDVSPTvX5KicYvDiiTVaNhdfKqN4c6nbhWRF/google.png)](https://play.google.com/store/apps/details?id=com.netsolutions.esteem \"This link will take you away from esteem\") |\n\n![eSteem Footer Line](https://img.esteem.ws/6uq66a9wam.png)\n<center>`info@esteem.app`\n🌐[`eSteem.app`](https://esteem.app) | 👨‍💻[`GitHub`](https://github.com/esteemapp) | 📺[`YouTube`](https://youtube.com/eSteemApp)\n✍🏻 [`Telegram`](https://t.me/esteemapp) | 💬[`Discord`](https://discord.gg/UrTnddT)\n[![Vote for @good-karma as a witness](https://steemitimages.com/0x0/https://img.esteem.ws/28m3yl1gfn.png)](https://steemit.com/~witnesses)\n</center>",
            "body_marked": "*\n\n### Why is <mark>eSteem</mark> <mark>Search</mark> better than any <mark>Search</mark> Engine for Steem content?",
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
        {
            "id": 64044573,
            "author": "pupu93",
            "permlink": "re-esteemapp-esteem-search-tips-c42f5a640930best-20181011t084740555z",
            "category": "esteem",
            "children": 0,
            "author_rep": 54.07,
            "title": "",
            "title_marked": null,
            "body": "very cool esteem search! I've tried it on the website https://search.esteem.app the results are very accurate and fast. thank you esteem for this convenience\n![Screenshot_2018-10-11-15-38-26-753_com.android.chrome.png](https://cdn.steemitimages.com/DQmVhF2EvoE4dFcmFu1QMqzZP3TPcVFJV4n9JeaKKJ8FYKD/Screenshot_2018-10-11-15-38-26-753_com.android.chrome.png)[source https://search.esteem.app](https://search.esteem.app )",
            "body_marked": "very cool <mark>esteem</mark> <mark>search</mark>!",
            "img_url": "https://cdn.steemitimages.com/DQmVhF2EvoE4dFcmFu1QMqzZP3TPcVFJV4n9JeaKKJ8FYKD/Screenshot_2018-10-11-15-38-26-753_com.android.chrome.png",
            "payout": 0,
            "total_votes": 0,
            "up_votes": 0,
            "created_at": "2018-10-11T08:47:48+00:00",
            "tags": [
                "esteem"
            ],
            "app": "steemit/0.1",
            "depth": 1
        },
    ]
};


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
                                <span>eSteem</span> Search / Api Docs
                            </div>
                        </div>
                        <div className="api-page-content">
                            <h2>Request Example</h2>

                            <pre className="code">{'>'} {requestUrl}</pre>

                            <h3>Parameters</h3>
                            <table className="table">
                                <tr>
                                    <th>q</th>
                                    <td>Query body</td>
                                </tr>
                                <tr>
                                    <th>sort</th>
                                    <td>Sort option. popularity | newest | relevance &nbsp;&nbsp;&nbsp; default: relevance</td>
                                </tr>
                                <tr>
                                    <th>scroll_id</th>
                                    <td>While a search request returns a single "page" of results, the scroll_id can be used to retrieve large numbers of results. You can use current result set's scroll_id for pagination</td>
                                </tr>
                            </table>
                            <h2>Example Response</h2>

                            <pre className="code">
                                {JSON.stringify(exampleResponse, undefined, 2)}
                            </pre>


                            <h2>Query format</h2>


                        </div>
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}


export default injectIntl(ApiDocs)
