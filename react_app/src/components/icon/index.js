import React, {Component} from 'react';

export default class Icon extends Component {
    render() {
        const {icon} = this.props;
        return (
            <i className="mi">{icon}</i>
        )
    }
}