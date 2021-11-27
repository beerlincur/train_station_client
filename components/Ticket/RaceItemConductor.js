import st from "./TicketItem.module.css"
import React, {useEffect, useRef, useState} from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import TicketInfo from "./TicketInfo";
import {convertDate} from "../../utils/utils";
import ApplicationsDocument from "../Shared/Document/Document";
import DlIcon from "../Shared/Icon";
import DlTable from "../Shared/Table";


const ticketsHeaders = [
    { name: "ticketId", label: "№" },
    { name: "depName", label: "Станция отправления" },
    { name: "arrName", label: "Станция прибытия" },
    { name: "carN", label: "Вагон" },
    { name: "seatN", label: "Место" },
    { name: "userFio", label: "Пассажир"},
    { name: "userPassport", label: "Пасспорт"},
    { name: "isInTrain", label: "В поезде"}
];

const roadHeaders = [
    { name: "index", label: "№", width: "50px" },
    { name: "number", label: "Номер станции", width: "50px" },
    { name: "name", label: "Название", width: "130px"},
    { name: "depTime", label: "Отбытие" },
    { name: "arrTime", label: "Прибытие" },
];

const RoadItemConductor = props => {
    const { push } = useRouter()

    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const getTicketRowClassName = (index, rowData) => {
        return rowData.isBought ? 'pinkRow' : 'greenCol'
    }

    const footerContentRef = useRef(null)

    const [isRoadCollapsed, setIsRoadCollapsed] = useState(true)

    const tag = props.tickets.length === 0 ? (
        {
            color: 'warning',
            label: "Билетов пока нет",
            dark: true,
        }
    ) : (
        props.tickets.every(t => t.is_bought) ? {
            color: 'error',
            label: "Раскуплен",
            dark: false,
        } : {
            color: 'success',
            label: "Доступен",
            dark: false,
        }
    )

    const roadTableData = props.stations.map((station, i) => {
        return {
            index: i + 1,
            number: station.station.station_id,
            name: station.station.name,
            arrTime: convertDate(station.arrival_time, { format: "dd.LL.yyyy в HH:mm" }),
            depTime: convertDate(station.departure_time, { format: "dd.LL.yyyy в HH:mm" }),
        }
    })

    const ticketsTableData = props.tickets.map((ticket, i) => {
                return {
                    ticketId: ticket.ticket_id,
                    depName: ticket.departure_station_name,
                    arrName: ticket.arrival_station_name,
                    carN: ticket.car_number,
                    seatN: ticket.seat_number,
                    isBought: ticket.is_bought,
                    userFio: ticket.user_second_name + ' ' + ticket.user_first_name,
                    userPassport: ticket.user_passport,
                    isInTrain: ticket.is_in_train ? "Да" : "Нет"
                }
            })


    return (
        <div
            className={cx(st.application, st.isDone)}
            onClick={() => push(`/tickets/${props.race_number}`)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={`Рейс №${props.race_number}`}
                        numberTitle={`${props.road.name}`}
                    />
                </div>
                <div className={cx(st.status, st.statusDone)}>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.stations[0].station.name}`} timeText={`${convertDate(props.stations[0].departure_time, { format: "dd.LL.yyyy в HH:mm" })}`} />
                    </div>
                    <div className={st.arrow}>-></div>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.stations[props.stations.length - 1].station.name}`} timeText={`${convertDate(props.stations[props.stations.length - 1].arrival_time, { format: "dd.LL.yyyy в HH:mm" })}` }/>
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
                                    tableData={roadTableData}
                                />
                            </div>
                        </div>
                        <div className={st.tableContainer}>
                            <div className={st.bigger_subtitle}>Билеты</div>
                            <div className={st.table}>
                                <DlTable
                                    headers={ticketsHeaders}
                                    tableData={ticketsTableData}
                                    rowClassName={getTicketRowClassName}
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

export default RoadItemConductor