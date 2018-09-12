import React, {Component} from 'react';

import './style/antd.css';
import './style/style.css';
import {connect} from 'react-redux';

import {Switch, Route} from 'react-router';
import Index from './pages/Index'
import Search from './pages/Search'


class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Index}/>
                <Route exact path="/search" component={Search}/>
            </Switch>
        );
    }
}

export default connect()(App);
