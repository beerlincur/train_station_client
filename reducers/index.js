import user from './user';
import { combineReducers } from "redux"
import { CLEAR_STORE } from '../actions/user';
import ticket from './ticket'

const appReducers = combineReducers({
    user,
    ticket
})

const rootReducer = (state, action) => {
    if (action.type === CLEAR_STORE) {
        state = {}
    }
    return appReducers(state, action)
};

export default rootReducer;
