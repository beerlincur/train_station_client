import {GET_TRAIN_LIST_SUCCESS, TRAIN_LIST_LOADING} from "../../actions/train";

const initialState = {
    trainsList: [],
    loader: false
};

const trainReducer = (state = initialState, action) => {
    switch (action.type) {
        case TRAIN_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_TRAIN_LIST_SUCCESS:
            return {
                ...state,
                trainsList: action.trainsList,
            };

        default:
            return state;
    }
}

export default trainReducer;