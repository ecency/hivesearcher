import React, {Component} from 'react';

import './style/antd.css';
import './style/style.css';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import Index from './pages/Index'
import Search from './pages/Search'

class App extends Component {
    render() {
        return (
            <Router>
                <div id="wrapper">
                    <Route exact path="/" component={Index}/>
                    <Route exact path="/search" component={Search}/>
                </div>
            </Router>
        );
    }
}

export default App;
