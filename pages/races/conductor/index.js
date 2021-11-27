import { useRouter } from "next/router";
import st from "./index.module.css";
import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import raceActions from "../../../actions/race";
import DefaultLayout from "../../../layouts/DefaultLayout";
import DlHeadTitle from "../../../components/Shared/HeadTitle";
import DlBreadcrumb from "../../../components/Shared/Breadcrumb";
import RoadItemConductor from "../../../components/Ticket/RaceItemConductor";


const RacesByConductorPage = () => {
    const { push, query } = useRouter();
    const dispatch = useDispatch();

    const { racesList, loader } = useSelector(state => state.race)
    const { currentUser } = useSelector(state => state.user)
    const currentUserId = currentUser && currentUser.user_id

    const [roadName, setRoadName] = useState('Рабочий график')

    useEffect(() => {
        dispatch(raceActions.getRacesByConductor());
    }, [currentUserId])

    useEffect(() => {
        if (currentUserId) {
            setRoadName(`Рабочий график - ${currentUser.first_name + ' ' + currentUser.second_name}`)
        }
    }, [currentUserId])

    return (
        <>
            <DlHeadTitle title={roadName} />
            <div className={st.title_container}>
                <div className={st.main}>
                    <DlBreadcrumb
                        currentIndex={2}
                        items={[
                            { index: 1, title: "Все рейсы", path: '/' },
                            { index: 2, title: roadName }
                        ]}
                    />
                    <h1 className={st.title}>{roadName}</h1>
                </div>
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (racesList.length === 0 ?
                            <div className={st.no_applications_label}>Рейсов пока нет</div>
                            :
                            racesList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <RoadItemConductor {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        </>
    )
}

RacesByConductorPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default RacesByConductorPage;