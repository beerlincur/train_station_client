import st from "./index.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useRouter} from "next/router";
import ticketActions from "../../../actions/ticket";
import DlHeadTitle from "../../../components/Shared/HeadTitle";
import TicketItemClient from "../../../components/Ticket/TicketItemClient";
import DefaultLayout from "../../../layouts/DefaultLayout";


const TicketsByRacePage = () => {
    const { push, query } = useRouter();
    const dispatch = useDispatch();

    const { ticketsList, loader } = useSelector(state => state.ticket)
    console.log(`loader tickets?race_id: ${loader}`)

    useEffect(() => {
        if (query.race_id) {
            dispatch(ticketActions.getTicketsByRace(query.race_id));
        }
    }, [query.race_id])

    return (
        <>
            <DlHeadTitle title={`Билеты на рейс #${query.race_id}`} />
            <div className={st.title_container}>
                <h1 className={st.title}>Билеты на рейс #{query.race_id}</h1>
            </div>
            <div className={st.applicationsList}>
                {loader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (ticketsList.length === 0 ?
                            <div className={st.no_applications_label}>Билетов пока нет</div>
                            :
                            ticketsList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <TicketItemClient {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        </>
    )
}

TicketsByRacePage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default TicketsByRacePage;