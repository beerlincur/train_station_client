import React, {useRef, useState} from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import {convertDate} from "../../utils/utils";
import ApplicationsDocument from "../Shared/Document/Document";
import DlIcon from "../Shared/Icon";
import DlTable from "../Shared/Table";
import st from "./OrderItemClient.module.css"
import TicketInfo from "../Ticket/TicketInfo";
import DlButton from "../Shared/Button";
import orderActions from "../../actions/order";
import {useDispatch} from "react-redux";
import DlInput from "../Shared/Input";
import DlFormItem from "../Shared/FormItem/FormItem";


const roadHeaders = [
    { name: "index", label: "№", width: "50px" },
    { name: "number", label: "Номер станции", width: "50px" },
    { name: "name", label: "Название", width: "130px"},
    { name: "depTime", label: "Отбытие" },
    { name: "arrTime", label: "Прибытие" },
];

const OrderItemClient = props => {
    const { push } = useRouter()
    const dispatch = useDispatch()

    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const footerContentRef = useRef(null)

    const [isRoadCollapsed, setIsRoadCollapsed] = useState(true)

    const tag = props.is_canceled ? {
        color: 'error',
        label: "Отменён",
        dark: false,
    } : {
        color: 'success',
        label: "Активен",
        dark: false,
    }

    const protocolTableData = props.ticket.stations.map((station, i) => {
        return {
            index: i + 1,
            number: station.station_id,
            name: station.name,
            arrTime: convertDate(station.arrival_time, { format: "dd.LL.yyyy в HH:mm" }),
            depTime: convertDate(station.departure_time, { format: "dd.LL.yyyy в HH:mm" }),
        }
    })

    const onCancelOrderClicked = () => {
        dispatch(orderActions.cancelOrder(props.order_id))
    }

    return (
        <div
            className={cx(st.application, st.isDone)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={`№${props.order_id} от ${convertDate(props.created_at, { format: "dd.LL.yyyy в HH:mm" })}`}
                        numberTitle={`${props.ticket.road.name}`}
                    />
                </div>
                <div className={cx(st.status, st.statusDone)}>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.ticket.departure_station.station.name}`} timeText={`${convertDate(props.ticket.departure_station.departure_time, { format: "dd.LL.yyyy в HH:mm" })}`} />
                    </div>
                    <div className={st.arrow}>-></div>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.ticket.arrival_station.station.name}`} timeText={`${convertDate(props.ticket.arrival_station.arrival_time, { format: "dd.LL.yyyy в HH:mm" })}` }/>
                    </div>
                </div>
                {(new Date()) < new Date(props.ticket.departure_station.departure_time) && !props.is_canceled &&
                    <div className={st.buy_button}>
                        <DlButton size="sm" type="error" onClick={onCancelOrderClicked}>Отменить</DlButton>
                    </div>
                }
            </div>
            <div className={st.footer} onClick={onFooterClick}>
                <div className={cx(st.footerContent, { [st.isCollapsed]: isRoadCollapsed })} ref={footerContentRef}>
                    <div className={st.collapseSamples}>
                        <div className={st.order_details}>
                            <div className={st.bigger_subtitle}>Детали</div>
                            <div className={cx(st.item, st.flex)}>
                                <div>
                                    <DlFormItem className={st.formItem} label="Номер билета">
                                        <DlInput value={props.ticket.ticket_id}
                                                 disabled
                                                 wrapperClass={st.input}
                                        />
                                    </DlFormItem>
                                </div>

                                <div>
                                    <DlFormItem className={st.formItem} label="Номер рейса">
                                        <DlInput value={props.ticket.race_number}
                                                 disabled
                                                 wrapperClass={st.input}
                                        />
                                    </DlFormItem>
                                </div>

                                <div>
                                    <DlFormItem className={st.formItem} label="Дата оформления">
                                        <DlInput value={convertDate(props.created_at, { format: "dd.LL.yyyy в HH:mm" })}
                                                 disabled
                                                 wrapperClass={st.input}
                                        />
                                    </DlFormItem>
                                </div>
                            </div>
                            <div className={cx(st.item, st.flex)}>
                                <div>
                                    <DlFormItem className={st.formItem} label="Номер поезда">
                                        <DlInput value={props.ticket.departure_station.train.train_id}
                                                 disabled
                                                 wrapperClass={st.input}
                                        />
                                    </DlFormItem>
                                </div>

                                <div>
                                    <DlFormItem className={st.formItem} label="Номер вагона">
                                        <DlInput value={props.ticket.car_number}
                                                 disabled
                                                 wrapperClass={st.input}
                                        />
                                    </DlFormItem>
                                </div>

                                <div>
                                    <DlFormItem className={st.formItem} label="Место">
                                        <DlInput value={props.ticket.seat_number}
                                                 disabled
                                                 wrapperClass={st.input}
                                        />
                                    </DlFormItem>
                                </div>
                            </div>
                        </div>
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

export default OrderItemClient