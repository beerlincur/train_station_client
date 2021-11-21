import {TICKET_LIST_LOADING, GET_TICKET_LIST_SUCCESS} from "../../actions/ticket";

const initialState = {
    ticketsList: [],
    loader: false
};

const ticketReducer = (state = initialState, action) => {
    switch (action.type) {
        case TICKET_LIST_LOADING:
            return {
                ...state,
                loader: !!action.loader,
            };

        case GET_TICKET_LIST_SUCCESS:
            return {
                ...state,
                ticketsList: action.ticketsList,
            };

        default:
            return state;
    }
}

export default ticketReducer;