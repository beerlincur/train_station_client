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
    loginUser: (obj, callback) => {
        return async dispatch => {
            dispatch({ type: USER_LOADING, loader: true })
            try {
                console.log('before request')
                console.log(`${API_URL}/login`)
                const resp = await axios.post(`http://localhost:8000/api/login`, obj)
                console.log('after resp')
                jsCookie.set(TOKEN_NAME, resp.data.access_token, { expires: 30 });
                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                console.log(`error ${error}`)
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 })
            } finally {
                dispatch({ type: USER_LOADING, loader: false })
            }
        }
    },
    getCurrentUser: (token, callback) => {
        return async dispatch => {
            dispatch({ type: USER_LOADING, loader: true })
            try {
                const resp = await axios.get(`http://localhost:8000/api/user`, getTokenConfig(token))
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
                const resp = await axios.post(`http://localhost:8000/api/register`, userData)
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
                const resp = await axios.put(`http://localhost:8000/api/user?user_id=${userId}`, body, getTokenConfig());

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
