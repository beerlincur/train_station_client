import st from "./TrainItem.module.css"
import React from "react";
import cx from "classnames";
import TicketInfo from "../Ticket/TicketInfo";


const TrainItem = props => {
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
                        dateTitle={`Номер поезда ${props.train_id}`}
                        numberTitle={`Поезд ${props.name}`}
                    />
                </div>
            </div>
        </div>
    )
}

export default TrainItem