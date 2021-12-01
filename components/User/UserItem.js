import st from "./UserItem.module.css"
import React from "react";
import cx from "classnames";
import TicketInfo from "../Ticket/TicketInfo";
import ApplicationsDocument from "../Shared/Document/Document";
import {ROLE_RUSSIAN} from "../../utils/utils";


const UserItem = props => {
    const tag = {
        color: 'success',
        label: "Активен",
        dark: false,
    }

    return (
        <div
            className={cx(st.application, st.isDone)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={`Пасспорт ${props.passport}`}
                        numberTitle={props.second_name + ' ' + props.first_name + (props.middle_name ? ' ' + props.middle_name : '')}
                    />
                </div>
                <div className={cx(st.status, st.statusDone)}>
                    <div className={st.document}>
                        <ApplicationsDocument title={`Кол-во поездок`} timeText={props.amount_of_orders} />
                    </div>
                    <div className={st.document}>
                        <ApplicationsDocument title={`Роль`} timeText={ROLE_RUSSIAN[props.role_id]}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserItem