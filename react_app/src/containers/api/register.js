/*
eslint-disable jsx-a11y/accessible-emoji
 */

import React, {Component, Fragment} from "react";

import {Link} from "react-router-dom";

import axios from "axios";

import hivesigner from "hivesigner";

import {injectIntl} from "react-intl";

import Footer from "../../components/footer";

import {API_URL} from "../../config";

import logo from "../../logo.png";


class ApiRegister extends Component {

    constructor(props) {
        super(props);

        this.state = {
            api_key: null,
            inProgress: false,
            done: false,
            err: null
        }
    }

    componentDidMount() {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('access_token');

        if (!token) {
            window.location.href = '/api-docs';
            return;
        }

        const client = new hivesigner.Client({
            accessToken: token
        });

        this.setState({inProgress: true});

        client.me().then(r => {
            this.setState({user: r.user});

            return axios.post(`${API_URL}api/register-api-key`, {u: r.user, t: token});
        }).then(resp => {
            const {data} = resp;

            if (data.code && data.code === 41) {
                this.setState({
                    error: data.message['Limit']
                })
            } else {
                this.setState({
                    api_key: data.api_key,
                    done: true
                });
            }

            this.setState({
                inProgress: false
            });
        });
    }

    done = () => {
        const {history} = this.props;
        history.push('/api-docs');
    };

    render() {
        const {api_key, inProgress, done, error} = this.state;

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
                            {inProgress && <div className="in-progress">Please wait...</div>}

                            {error && <div className="register-response-error">{error}</div>}

                            {(done && !inProgress) &&
                            <div className="register-response">
                                <h3><span>🎉</span> Your API key! <span>🎉</span></h3>
                                <p><code className="code">{api_key}</code></p>
                                <p>Don't forget to Copy and Backup your API key, keep it safe!</p>
                                <p>
                                    <button onClick={this.done}>Finish</button>
                                </p>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <Footer/>
            </Fragment>
        );
    }
}


export default injectIntl(ApiRegister)
