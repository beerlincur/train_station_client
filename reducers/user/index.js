import { GET_USER_SUCCESS, USER_LOADING } from "../../actions/user";

const initialState = {
    currentUser: null,
    loader: false,
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

        default:
            return state;
    }
}

export default userReducer;
