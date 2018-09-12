import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';
import {routerMiddleware, routerActions} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

export const configureStore = (initialState = {}) => {
    const middleware = [];
    const enhancers = [];

    middleware.push(thunk);

    const router = routerMiddleware(history);
    middleware.push(router);

    // Redux DevTools Configuration
    const actionCreators = {
        ...routerActions
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    const composeEnehancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Options: http://extension.remotedev.io/docs/API/Arguments.html
            actionCreators
        })
        : compose;


    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware));
    const enhancer = composeEnehancers(...enhancers);

    // Create Store
    return createStore(rootReducer, initialState, enhancer);
};


