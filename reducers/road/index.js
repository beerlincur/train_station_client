import {GET_ROAD_LIST_SUCCESS, ROAD_LIST_LOADING} from "../../actions/road";

const initialState = {
    roadsList: [],
    loader: false
};

const roadReducer = (state = initialState, action) => {
    switch (action.type) {
        case ROAD_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_ROAD_LIST_SUCCESS:
            return {
                ...state,
                roadsList: action.roadsList,
            };

        default:
            return state;
    }
}

export default roadReducer;