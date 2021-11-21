import user from './user';
import { combineReducers } from "redux"
import { CLEAR_STORE } from '../actions/user';


const appReducers = combineReducers({
    user,
})

const rootReducer = (state, action) => {
    if (action.type === CLEAR_STORE) {
        state = {}
    }
    return appReducers(state, action)
};

export default rootReducer;
