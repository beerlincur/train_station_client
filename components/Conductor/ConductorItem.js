import st from "./ConductorItem.module.css"
import React from "react";
import cx from "classnames";
import TicketInfo from "../Ticket/TicketInfo";


const ConductorItem = props => {
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
            </div>
        </div>
    )
}

export default ConductorItem