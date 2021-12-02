import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";
import {GET_RACE_LIST_SUCCESS, RACE_LIST_LOADING} from "./race";
import {GET_ROAD_LIST_SUCCESS, ROAD_LIST_LOADING} from "./road";

export const ROAD_STATION_LIST_LOADING = "ROAD_STATION_LIST_LOADING"
export const GET_ROAD_STATION_LIST_SUCCESS = "GET_ROAD_STATION_LIST_SUCCESS"

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
    },
    getByRace: (raceNumber, callback, onError) => {
        return async dispatch => {
            dispatch({ type: ROAD_STATION_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/race/road_stations?race_number=${raceNumber}`, getTokenConfig());
                dispatch({ type: GET_ROAD_STATION_LIST_SUCCESS, roadStationsList: resp.data.road_stations });
                console.log(`resp.road_id ${resp.data.road_id}`)
                if (typeof callback === "function") {
                    callback.call(this, resp.data.road_id);
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: ROAD_STATION_LIST_LOADING, loader: false })
            }
        }
    }
}

export default roadStationActions