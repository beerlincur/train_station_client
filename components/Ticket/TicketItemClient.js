import st from "./TicketItem.module.css"
import React, {useRef, useState} from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import DlTag from "../Shared/Tag";
import TicketInfo from "./TicketInfo";
import {convertDate, ROLE} from "../../utils/utils";
import ApplicationsDocument from "../Shared/Document/Document";
import DlIcon from "../Shared/Icon";
import DlTable from "../Shared/Table";
import DlButton from "../Shared/Button";
import orderActions from "../../actions/order";
import DomNotification from "../Shared/DomNotification";
import {useDispatch, useSelector} from "react-redux";


const roadHeaders = [
    { name: "index", label: "№", width: "50px" },
    { name: "number", label: "Номер станции", width: "50px" },
    { name: "name", label: "Название", width: "130px"},
    { name: "depTime", label: "Отбытие" },
    { name: "arrTime", label: "Прибытие" },
];

const TicketItemClient = props => {
    const { push } = useRouter()
    const dispatch = useDispatch()

    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const footerContentRef = useRef(null)

    const [isRoadCollapsed, setIsRoadCollapsed] = useState(true)

    const { currentUser } = useSelector(state => state.user)

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

    const onBuyClicked = ev => {
        ev.stopPropagation()
        dispatch(orderActions.createOrder(props.ticket_id))
        push('/passport/account/')
        DomNotification.success({ title: "Заказ успешно создан", showClose: true, duration: 5000 });
    }

    return (
        <div
            className={cx(st.application, st.isDone)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={`Билет №${props.ticket_id} Вагон ${props.car_number} Место ${props.seat_number}`}
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
                {!props.is_bought && new Date() < new Date(props.departure_station.departure_time) && currentUser.role_id === ROLE.client &&
                <div className={st.buy_button}>
                    <DlButton size="sm" type="primary" onClick={onBuyClicked}>Купить</DlButton>
                </div>
                }
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