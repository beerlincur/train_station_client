import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import {API_URL} from "../utils/constants";
import axios from "axios";

export const TICKET_LIST_LOADING = "TICKET_LIST_LOADING";
export const GET_APPLICATION_LIST_SUCCESS = "GET_APPLICATION_LIST_SUCCESS";

const ticketActions = {
    getAllTickets: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: TICKET_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`${API_URL}/tickets/feed`, getTokenConfig());
                dispatch({ type: GET_APPLICATION_LIST_SUCCESS, applicationsList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: TICKET_LIST_LOADING, loader: false })
            }
        }
    }
}

export default ticketActions