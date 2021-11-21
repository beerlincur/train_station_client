import jsCookie from 'js-cookie'
import axios from "axios"
import DomNotification from '../components/Shared/DomNotification';
import { API_URL, TOKEN_NAME } from "../utils/constants";
import { getTokenConfig } from "../utils/utils";

export const USER_LOADING = "USER_LOADING";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const UPDATE_PROFILE_LOADING = "UPDATE_PROFILE_LOADING";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const CLEAR_STORE = "CLEAR_STORE";


const userActions = {
    getCurrentUser: (token, callback) => {
        return async dispatch => {
            dispatch({ type: USER_LOADING, loader: true })
            try {
                const resp = await axios.get(`${API_URL}/user`, getTokenConfig(token))
                dispatch({ type: GET_USER_SUCCESS, user: resp.data })
                // dispatch({ type: GET_USER_SUCCESS, user: { ...resp.data, role: "laboratory" } })

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 })
            } finally {
                dispatch({ type: USER_LOADING, loader: false })
            }
        }
    },
    registerUser: (userData, callback, onError) => {
        return async dispatch => {
            dispatch({ type: USER_LOADING, loader: true })
            try {
                const resp = await axios.post(`${API_URL}/register`, userData)
                // dispatch({ type: GET_USER_SUCCESS, user: resp.data })
                if (typeof callback === "function") callback.call();
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 })
                if (typeof onError === "function") onError.call();
            } finally {
                dispatch({ type: USER_LOADING, loader: false })
            }
        }

    },
    updateUser: (obj, userId, callback) => {
        return async dispatch => {
            dispatch({type: UPDATE_PROFILE_LOADING, loader: true});
            try {
                const body = JSON.stringify(obj);
                const resp = await axios.put(`${API_URL}/user?user_id=${userId}`, body, getTokenConfig());

                dispatch({type: UPDATE_PROFILE_SUCCESS, currentUser: resp.data});

                if (typeof (callback) === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500});
            } finally {
                dispatch({type: UPDATE_PROFILE_LOADING, loader: false})
            }
        }
    },
    logout: (callback) => {
        return async dispatch => {
            dispatch({ type: CLEAR_STORE });
            if (typeof (callback) === "function") {
                callback.call();
            }
        }
    },
}

export default userActions;
