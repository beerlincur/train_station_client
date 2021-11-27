import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";

export const STATION_LIST_LOADING = "STATION_LIST_LOADING";
export const GET_STATION_LIST_SUCCESS = "GET_STATION_LIST_SUCCESS";

const stationActions = {
    getAllStations: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: STATION_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/stations/all`, getTokenConfig());
                dispatch({ type: GET_STATION_LIST_SUCCESS, stationsList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: STATION_LIST_LOADING, loader: false })
            }
        }
    }
}

export default stationActions