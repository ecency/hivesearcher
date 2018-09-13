import {combineReducers} from 'redux'
import results from './results'
import count from './count'

export default combineReducers({
    count,
    results
})