import {GET_RACE_LIST_SUCCESS, RACE_LIST_LOADING} from "../../actions/race";

const initialState = {
    racesList: [],
    loader: false
};

const raceReducer = (state = initialState, action) => {
    switch (action.type) {
        case RACE_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_RACE_LIST_SUCCESS:
            return {
                ...state,
                racesList: action.racesList,
            };

        default:
            return state;
    }
}

export default raceReducer;