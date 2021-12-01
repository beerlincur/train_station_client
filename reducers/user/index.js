import {
    GET_USER_SUCCESS,
    USER_LOADING,
    CONDUCTORS_LIST_LOADING,
    GET_CONDUCTORS_LIST_SUCCESS,
    USERS_LIST_LOADING, GET_USERS_LIST_SUCCESS
} from "../../actions/user";

const initialState = {
    currentUser: null,
    loader: false,
    conductorsList: [],
    conductorsListLoader: false,
    usersList: [],
    usersListLoader: false
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

        case USERS_LIST_LOADING:
            return {
                ...state,
                usersListLoader: !!action.usersListLoader,
            };

        case GET_USERS_LIST_SUCCESS:
            return {
                ...state,
                usersList: action.usersList,
            };

        default:
            return state;
    }
}

export default userReducer;
