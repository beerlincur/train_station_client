import st from "./index.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from "next/router";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import StationItem from "../../components/Station/StationItem";
import stationActions from "../../actions/station";


const StationsPage = () => {
    const dispatch = useDispatch();

    const { stationsList, loader } = useSelector(state => state.station)

    useEffect(() => {
        dispatch(stationActions.getAllStations());
    }, [])

    return (
        <>
            <DlHeadTitle title={`Станции`} />
            <div className={st.title_container}>
                <div className={st.main}>
                    <h1 className={st.title}>Станции</h1>
                </div>
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (stationsList.length === 0 ?
                            <div className={st.no_applications_label}>Станций пока нет</div>
                            :
                            stationsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <StationItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        </>
    )
}

StationsPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default StationsPage;