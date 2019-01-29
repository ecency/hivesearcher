import React, {Component} from 'react';
import {version} from "../../../package.json";

export default class Footer extends Component {
    render() {

        return (
            <div className="main-footer">
                <a className="footer-brand" href="https://esteem.app/" rel="noopener noreferrer"
                   target="_blank">eSteem</a>
                <span className="ver">v{version}</span>
            </div>
        )
    }
}