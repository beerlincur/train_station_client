import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";

export const ORDER_LIST_LOADING = "ORDER_LIST_LOADING";
export const GET_ORDER_LIST_SUCCESS = "GET_ORDER_LIST_SUCCESS";

const orderActions = {
    getUserOrders: (raceId, callback, onError) => {
        return async dispatch => {
            dispatch({ type: ORDER_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/orders`, getTokenConfig());
                dispatch({ type: GET_ORDER_LIST_SUCCESS, ordersList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: ORDER_LIST_LOADING, loader: false })
            }
        }
    },
    createOrder: (ticketId, callback, onError) => {
        return async dispatch => {
            dispatch({ type: ORDER_LIST_LOADING, loader: true });
            try {
                const body = JSON.stringify({ticket_id: ticketId});
                const resp = await axios.post(`http://localhost:8000/api/order/create`, body, getTokenConfig());
                dispatch({ type: GET_ORDER_LIST_SUCCESS, ordersList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: ORDER_LIST_LOADING, loader: false })
            }
        }
    },
    cancelOrder: (orderId, callback, onError) => {
        return async dispatch => {
            dispatch({ type: ORDER_LIST_LOADING, loader: true });
            try {
                const body = JSON.stringify({order_id: orderId});
                const resp = await axios.put(`http://localhost:8000/api/order/cancel`, body, getTokenConfig());
                dispatch({ type: GET_ORDER_LIST_SUCCESS, ordersList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: ORDER_LIST_LOADING, loader: false })
            }
        }
    }
}

export default orderActions