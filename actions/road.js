import DomNotification from "../components/Shared/DomNotification";
import {getTokenConfig} from "../utils/utils";
import axios from "axios";

export const ROAD_LIST_LOADING = "ROAD_LIST_LOADING";
export const GET_ROAD_LIST_SUCCESS = "GET_ROAD_LIST_SUCCESS";

const roadActions = {
    getAllRoads: (callback, onError) => {
        return async dispatch => {
            dispatch({ type: ROAD_LIST_LOADING, loader: true });
            try {
                const resp = await axios.get(`http://localhost:8000/api/roads/feed`, getTokenConfig());
                dispatch({ type: GET_ROAD_LIST_SUCCESS, roadsList: resp.data });

                if (typeof callback === "function") {
                    callback.call();
                }
            } catch (error) {
                DomNotification.error({ title: "Произошла непредвиденная ошибка!", showClose: true, duration: 2500 });
                if (typeof onError === "function") {
                    onError.call();
                }
            } finally {
                dispatch({ type: ROAD_LIST_LOADING, loader: false })
            }
        }
    }
}

export default roadActions