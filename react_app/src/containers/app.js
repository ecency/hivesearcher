import React from 'react'
import {Route} from 'react-router-dom'
import Home from './home'
import Search from './search'
import About from './about'


const App = () => (
    <div id="wrapper">
        <Route exact path="/" component={Home}/>
        <Route exact path="/search" component={Search}/>
        <Route exact path="/about" component={About}/>
    </div>
);

export default App