import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {version} from "../../../package.json";

export default class Footer extends Component {
    render() {

        return (
            <div className="main-footer">
                <a className="footer-link" href="https://esteem.app/" rel="noopener noreferrer"
                   target="_blank">eSteem</a>
                <span className="separator">|</span>
                <Link to="/api-docs" className="footer-link">API</Link>
                <span className="space"/>
                <span className="ver">v{version}</span>
            </div>
        )
    }
}