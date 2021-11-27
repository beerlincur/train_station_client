import user from './user';
import { combineReducers } from "redux"
import { CLEAR_STORE } from '../actions/user';
import ticket from './ticket'
import race from "./race";
import order from "./order";
import road from "./road";
import station from "./station";

const appReducers = combineReducers({
    user,
    ticket,
    race,
    order,
    road,
    station
})

const rootReducer = (state, action) => {
    if (action.type === CLEAR_STORE) {
        state = {}
    }
    return appReducers(state, action)
};

export default rootReducer;
