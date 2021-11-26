import st from "./index.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from "next/router";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import RoadItem from "../../components/Road/RoadItem";
import roadActions from "../../actions/road";


const RoadsPage = () => {
    const { push } = useRouter();
    const dispatch = useDispatch();

    const { roadsList, loader } = useSelector(state => state.road)

    useEffect(() => {
        dispatch(roadActions.getAllRoads());
    }, [])

    return (
        <>
            <DlHeadTitle title={`Направления`} />
            <div className={st.title_container}>
                <div className={st.main}>
                    <h1 className={st.title}>Направления</h1>
                </div>
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (roadsList.length === 0 ?
                            <div className={st.no_applications_label}>Направлений пока нет</div>
                            :
                            roadsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <RoadItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        </>
    )
}

RoadsPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default RoadsPage;