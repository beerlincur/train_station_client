import {GET_ORDER_LIST_SUCCESS, ORDER_LIST_LOADING} from "../../actions/order";

const initialState = {
    ordersList: [],
    loader: false
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case ORDER_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_ORDER_LIST_SUCCESS:
            return {
                ...state,
                ordersList: action.ordersList,
            };

        default:
            return state;
    }
}

export default orderReducer;