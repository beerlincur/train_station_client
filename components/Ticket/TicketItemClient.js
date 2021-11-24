import st from "./TicketItem.module.css"
import React, {useRef, useState} from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import DlTag from "../Shared/Tag";
import TicketInfo from "./TicketInfo";
import {convertDate} from "../../utils/utils";
import ApplicationsDocument from "../Shared/Document/Document";
import DlIcon from "../Shared/Icon";
import DlTable from "../Shared/Table";


const roadHeaders = [
    { name: "index", label: "№", width: "50px" },
    { name: "number", label: "Номер станции", width: "50px" },
    { name: "name", label: "Название", width: "130px"},
    { name: "depTime", label: "Отбытие" },
    { name: "arrTime", label: "Прибытие" },
];

const TicketItemClient = props => {
    const { push } = useRouter()

    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const footerContentRef = useRef(null)

    const [isRoadCollapsed, setIsRoadCollapsed] = useState(true)

    const tag = props.is_bought ? {
        color: 'error',
        label: "Куплен",
        dark: false,
    } : {
        color: 'success',
        label: "Доступен",
        dark: false,
    }

    const protocolTableData = props.stations.map((station, i) => {
        return {
            index: i + 1,
            number: station.station_id,
            name: station.name,
            arrTime: convertDate(station.arrival_time, { format: "dd.LL.yyyy в HH:mm" }),
            depTime: convertDate(station.departure_time, { format: "dd.LL.yyyy в HH:mm" }),
        }
    })

    return (
        <div
            className={cx(st.application, st.isDone)}
            onClick={() => push(`/ticket/${props.ticket_id}`)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={`Билет №${props.ticket_id}`}
                        numberTitle={`${props.road.name}`}
                    />
                </div>
                <div className={cx(st.status, st.statusDone)}>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.departure_station.station.name}`} timeText={`${convertDate(props.departure_station.departure_time, { format: "dd.LL.yyyy в HH:mm" })}`} />
                    </div>
                    <div className={st.arrow}>-></div>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.arrival_station.station.name}`} timeText={`${convertDate(props.arrival_station.arrival_time, { format: "dd.LL.yyyy в HH:mm" })}` }/>
                    </div>
                </div>
            </div>
            <div className={st.footer} onClick={onFooterClick}>
                <div className={cx(st.footerContent, { [st.isCollapsed]: isRoadCollapsed })} ref={footerContentRef}>
                    <div className={st.collapseSamples}>
                        <div className={st.tableContainer}>
                            <div className={st.bigger_subtitle}>Проезжаемые станции</div>
                            <div className={st.table}>
                                <DlTable
                                    headers={roadHeaders}
                                    tableData={protocolTableData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={st.footerTitle} onClick={() => setIsRoadCollapsed(!isRoadCollapsed)}>
                        <span className={cx(st.footerIcon, { [st.iconCollapsed]: isRoadCollapsed })}>
                            <DlIcon name="keyboard_arrow_down" />
                        </span>
                    <span>{isRoadCollapsed ? 'Показать' : 'Скрыть'} подробности</span>
                </div>
            </div>
        </div>
    )
}

export default TicketItemClient