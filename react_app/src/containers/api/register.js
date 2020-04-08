/*
eslint-disable jsx-a11y/accessible-emoji
 */

import React, {Component, Fragment} from "react";
import {Link} from "react-router-dom";
import logo from "../../logo.png";
import axios from "axios";

import Footer from "../../components/footer"

import {injectIntl} from "react-intl";
import {API_URL} from '../../config';

import hivesigner from 'hivesigner';


class ApiRegister extends Component {

  constructor(props) {
    super(props);

    this.state = {
      packages: [],
      pack: 2,
      step: 1,
      api_key: null,
      payment_key: null,
      inProgress: false,
      done: false,
      err: null
    }
  }

  componentDidMount() {


    this.fetchPackages().then(packages => {
      this.setState({packages});
      return packages;
    }).then((packages) => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('access_token');
      const pack = url.searchParams.get('state');
      const packNum = parseInt(pack, 10);

      if (token && pack && packages.find(x => x.id === packNum)) {

        this.setState({pack: packNum});

        const client = new hivesigner.Client({
          accessToken: token
        });

        this.setState({inProgress: true});

        client.me().then(r => {
          this.setState({user: r.user, step: 2});

          return axios.post(`${API_URL}api/register-api-key`, {u: r.user, t: token, p: pack});
        }).then(resp => {
          const {data} = resp;

          if (data.code && data.code === 41) {
            this.setState({
              error: data.message['Limit']
            })
          } else {
            this.setState({
              api_key: data.api_key,
              payment_key: data.payment_key,
              done: true
            });
          }

          this.setState({
            inProgress: false
          })
        })
      }
    });
  }

  fetchPackages = () => axios.get(`${API_URL}api/api-packages`).then(resp => resp.data);

  login = () => {
    const client = new hivesigner.Client({
      app: 'esteemapp',
      callbackURL: `${window.location.origin}/api-register`,
      scope: ['login']
    });

    const {pack} = this.state;
    window.location.href = client.getLoginURL(pack);
  };

  packageChanged = (e) => {
    this.setState({pack: parseInt(e.target.value, 10)})
  };

  done = () => {
    const {history} = this.props;
    history.push('/api-docs');
  };

  render() {

    const {packages, pack, step, api_key, payment_key, inProgress, done, error} = this.state;

    const pa = packages.length > 0 ? packages.find(x => x.id === pack) : null;
    const price = pa ? pa.price : '';
    const price_steem = pa ? pa.price_steem : '';

    return (
      <Fragment>
        <div className="main-container">
          <div className="api-page">
            <div className="header">
              <Link to="/" className="logo">
                <img src={logo} className="App-logo" alt="logo"/>
              </Link>
              <div className="brand">
                <span>Esteem</span> Search / API
              </div>
            </div>
            <div className="api-page-content">
              {(packages.length > 0 && step === 1 && !inProgress) &&
              <div className="package-select">
                <p>Select package</p>
                <select value={pack} onChange={this.packageChanged}>
                  {packages.map(i => {
                      let content = '';

                      if (i.id === 1) {
                        content = `- ${i.request_limit} requests - Free`;
                      } else {
                        content = `- ${i.request_limit} requests / day - ${i.price} SBD or ${i.price_steem} STEEM  monthly`;
                      }

                      return <option key={i.id} value={i.id}>{i.name} {content}</option>
                    }
                  )}
                </select>
                <p>
                  <button onClick={this.login}>Register your API key</button>
                </p>
              </div>
              }

              {inProgress && <div className="in-progress">Please wait...</div>}

              {error && <div className="register-response-error">{error}</div>}

              {(step === 2 && !inProgress) &&
              <div className="register-response">
                {done &&
                <Fragment>
                  <h3><span>🎉</span> Your API key! <span>🎉</span></h3>
                  <code className="code">{api_key}</code>
                  {payment_key &&
                  <p>
                    API key is generated but NOT active yet.<br/>
                    To activate it, please send {price} HBD or {price_steem} HIVE to <a href="https://esteem.app/@esteemapp"
                                                                  target="_blank"
                                                                  rel="noopener noreferrer">@esteemapp</a> with
                    following text <br/> <code> {payment_key}</code> <br/> in memo field.<br/>
                    Once payment is confirmed API key will be activated, <br/>otherwise after 30
                    minutes generated key will be deleted.<br/><br/>
                    Don't forget to Copy and Backup your API key, keep it safe!<br/><br/>
                  </p>
                  }
                  <p>
                    <button onClick={this.done}>Finish</button>
                  </p>
                </Fragment>
                }
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
