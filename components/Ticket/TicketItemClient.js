import st from "./TicketItem.module.css"
import React from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import DlTag from "../Shared/Tag";
import TicketInfo from "./TicketInfo";
import {convertDate} from "../../utils/utils";
import ApplicationsDocument from "../Shared/Document/Document";


const TicketItemClient = props => {
    const { push } = useRouter()
    const tag = {
        color: 'success',
        courierColor: "",
        label: "Доступен",
        dark: false,
        courierDark: false,
    }

    const docLinks = [
        { title: `Акт отбора проб`, ticketId: props.ticket_id, reportType: 'act_of_samples' },
        { title: `Результаты исследования`, ticketId: props.ticket_id, reportType: 'results' }
    ]

    return (
        <div
            className={cx(st.application, st.isDone)}
            onClick={() => push(`/ticket/${props.ticket_id}`)}
        >
            <div className={st.info}>
                <TicketInfo
                    tag={tag}
                    dateTitle={`Принята ${convertDate(new Date(), { hours: true, format: 'dd MMMM в HH:mm' })}`}
                    numberTitle={`Билет №${props.ticket_id}`}
                />
            </div>
            <div className={cx(st.status, st.statusDone)}>
                {docLinks.map((doc, i) => (
                    <div className={st.document} key={i}>
                        <ApplicationsDocument {...doc} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TicketItemClient