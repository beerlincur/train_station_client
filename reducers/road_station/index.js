import {GET_ROAD_STATION_LIST_SUCCESS, ROAD_STATION_LIST_LOADING} from "../../actions/road_station";

const initialState = {
    roadStationsList: [],
    loader: false
};

const roadStationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ROAD_STATION_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_ROAD_STATION_LIST_SUCCESS:
            return {
                ...state,
                roadStationsList: action.roadStationsList,
            };

        default:
            return state;
    }
}

export default roadStationReducer;