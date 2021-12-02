import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import {API_URL} from "../utils/constants";
import axios from "axios";
import {GET_RACE_LIST_SUCCESS, RACE_LIST_LOADING} from "./race";

export const TICKET_LIST_LOADING = "TICKET_LIST_LOADING";
export const GET_TICKET_LIST_SUCCESS = "GET_TICKET_LIST_SUCCESS";

const ticketActions = {
    getAllTickets: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: TICKET_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/tickets/all`, getTokenConfig());
                dispatch({ type: GET_TICKET_LIST_SUCCESS, ticketsList: resp.data });

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
    },
    getTicketsByRace: (raceId, callback, onError) => {
        return async dispatch => {
            dispatch({ type: TICKET_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/tickets?race_id=${raceId}`, getTokenConfig());
                dispatch({ type: GET_TICKET_LIST_SUCCESS, ticketsList: resp.data });

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
    },
    updateTicketIsInTrain: (ticketId, is_in_train, callback, onError) => {
        return async dispatch => {
            dispatch({ type: RACE_LIST_LOADING, loader: true });
            try {
                const body = JSON.stringify({ticket_id: ticketId, is_in_train: is_in_train});
                const resp = await axios.put(`http://localhost:8000/api/ticket/set_is_in_train`, body, getTokenConfig());
                dispatch({ type: GET_RACE_LIST_SUCCESS, racesList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: RACE_LIST_LOADING, loader: false })
            }
        }
    },
    addTicket: (obj, callback, onError) => {
        return async dispatch => {
            dispatch({ type: TICKET_LIST_LOADING, loader: true });
            try {
                const body = JSON.stringify(obj);
                const resp = await axios.post(`http://localhost:8000/api/ticket/create`, body, getTokenConfig());
                dispatch({ type: GET_TICKET_LIST_SUCCESS, ticketsList: resp.data });

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