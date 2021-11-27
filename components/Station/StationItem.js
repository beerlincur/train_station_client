import st from "./StationItem.module.css"
import React from "react";
import cx from "classnames";
import TicketInfo from "../Ticket/TicketInfo";


const StationItem = props => {
    const tag = {
        color: 'success',
        label: "Активна",
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
                        dateTitle={`Номер станции ${props.station_id}`}
                        numberTitle={`Станция ${props.name}`}
                    />
                </div>
            </div>
        </div>
    )
}

export default StationItem