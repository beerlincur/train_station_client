import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";
import {GET_RACE_LIST_SUCCESS, RACE_LIST_LOADING} from "./race";

const roadStationActions = {
    addRoadStation: (obj, callback, onError) => {
        return async dispatch => {
            dispatch({ type: RACE_LIST_LOADING, loader: true })
            try {
                const resp = await axios.post(`http://localhost:8000/api/road_station/create`, obj, getTokenConfig())
                dispatch({ type: GET_RACE_LIST_SUCCESS, racesList: resp.data });
                if (typeof callback === "function") callback.call();
            } catch (error) {
                DomNotification.error({ title: "Ошибка при добавлении станции маршрута", showClose: true, duration: 2500 })
                if (typeof onError === "function") onError.call();
            } finally {
                dispatch({ type: RACE_LIST_LOADING, loader: false })
            }
        }

    }
}

export default roadStationActions