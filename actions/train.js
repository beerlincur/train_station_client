import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";

export const TRAIN_LIST_LOADING = "TRAIN_LIST_LOADING";
export const GET_TRAIN_LIST_SUCCESS = "GET_TRAIN_LIST_SUCCESS";

const trainActions = {
    getAllTrains: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: TRAIN_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/trains/all`, getTokenConfig());
                dispatch({ type: GET_TRAIN_LIST_SUCCESS, trainsList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: TRAIN_LIST_LOADING, loader: false })
            }
        }
    },
    addTrain: (obj, callback, onError) => {
        return async dispatch => {
            dispatch({ type: TRAIN_LIST_LOADING, loader: true })
            try {
                const resp = await axios.post(`http://localhost:8000/api/train/create`, obj, getTokenConfig())
                dispatch({ type: GET_TRAIN_LIST_SUCCESS, trainsList: resp.data });
                if (typeof callback === "function") callback.call();
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 })
                if (typeof onError === "function") onError.call();
            } finally {
                dispatch({ type: TRAIN_LIST_LOADING, loader: false })
            }
        }

    }
}

export default trainActions