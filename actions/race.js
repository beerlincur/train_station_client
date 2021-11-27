import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";

export const RACE_LIST_LOADING = "RACE_LIST_LOADING";
export const GET_RACE_LIST_SUCCESS = "GET_RACE_LIST_SUCCESS";

const raceActions = {
    getAllRaces: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: RACE_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/races/feed`, getTokenConfig());
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
    getRacesByRoad: (roadId, callback, onError) => {
        return async dispatch => {
            dispatch({ type: RACE_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/road/races?road_id=${roadId}`, getTokenConfig());
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
    getRacesByConductor: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: RACE_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/races/conductor`, getTokenConfig());
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
    }
}

export default raceActions