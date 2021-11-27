import {GET_STATION_LIST_SUCCESS, STATION_LIST_LOADING} from "../../actions/station";

const initialState = {
    stationsList: [],
    loader: false
};

const stationReducer = (state = initialState, action) => {
    switch (action.type) {
        case STATION_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_STATION_LIST_SUCCESS:
            return {
                ...state,
                stationsList: action.stationsList,
            };

        default:
            return state;
    }
}

export default stationReducer;