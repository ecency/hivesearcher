import React, {Component} from 'react';
import {parseQuery} from '../util'


export default class Search extends Component {

    componentDidMount() {

        const {location, history} = this.props;
        const qs = parseQuery(location.search);
        if (qs.q === undefined || qs.q.trim() === '') {
            history.push(`/`);
        }

        console.log(qs)
    }

    render() {
        return (
            <div className="App">
                <h1>Search</h1>
            </div>
        );
    }
}
