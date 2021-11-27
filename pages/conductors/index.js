import st from "./index.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import userActions from "../../actions/user";
import ConductorItem from "../../components/Conductor/ConductorItem";


const ConductorsPage = () => {
    const dispatch = useDispatch();

    const { conductorsList, conductorsListLoader } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(userActions.getAllConductors());
    }, [])

    return (
        <>
            <DlHeadTitle title={`Проводники`} />
            <div className={st.title_container}>
                <div className={st.main}>
                    <h1 className={st.title}>Проводники</h1>
                </div>
            </div>
            <div className={st.applicationsList}>
                {conductorsListLoader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (conductorsList.length === 0 ?
                            <div className={st.no_applications_label}>Проводников пока нет</div>
                            :
                            conductorsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <ConductorItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        </>
    )
}

ConductorsPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default ConductorsPage;