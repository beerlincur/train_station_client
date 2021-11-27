import {GET_USER_SUCCESS, USER_LOADING, CONDUCTORS_LIST_LOADING, GET_CONDUCTORS_LIST_SUCCESS} from "../../actions/user";

const initialState = {
    currentUser: null,
    loader: false,
    conductorsList: [],
    conductorsListLoader: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_USER_SUCCESS:
            return {
                ...state,
                currentUser: action.user,
            };

        case CONDUCTORS_LIST_LOADING:
            return {
                ...state,
                conductorsListLoader: !!action.conductorsListLoader,
            };

        case GET_CONDUCTORS_LIST_SUCCESS:
            return {
                ...state,
                conductorsList: action.conductorsList,
            };

        default:
            return state;
    }
}

export default userReducer;
