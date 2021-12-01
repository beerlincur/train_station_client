import st from "./RoadItem.module.css"
import React, {useRef, useState} from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import {convertDate} from "../../utils/utils";
import ApplicationsDocument from "../Shared/Document/Document";
import DlIcon from "../Shared/Icon";
import DlTable from "../Shared/Table";
import {useDispatch} from "react-redux";
import TicketInfo from "../Ticket/TicketInfo";
import DlFormItem from "../Shared/FormItem/FormItem";
import DlInput from "../Shared/Input";


const roadHeaders = [
    { name: "index", label: "№", width: "50px" },
    { name: "number", label: "Номер станции", width: "50px" },
    { name: "name", label: "Название", width: "130px"},
];

const RoadItem = props => {
    const { push } = useRouter()
    const dispatch = useDispatch()

    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const footerContentRef = useRef(null)

    const [isRoadCollapsed, setIsRoadCollapsed] = useState(true)

    const tag = {
        color: 'success',
        label: "Доступно",
        dark: false,
    }

    const protocolTableData = props.stations.map((station, i) => {
        return {
            index: i + 1,
            number: station.station_id,
            name: station.name,
        }
    })

    return (
        <div
            className={cx(st.application, st.isDone)}
            onClick={() => push(`/races/${props.road_id}`)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={``}
                        numberTitle={`${props.name}`}
                    />
                </div>
                <div className={cx(st.status, st.statusDone)}>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.stations[0].name}`} />
                    </div>
                    <div className={st.arrow}>-></div>
                    <div className={st.document}>
                        <ApplicationsDocument title={`${props.stations[props.stations.length - 1].name}`}/>
                    </div>
                </div>
            </div>
            <div className={st.footer} onClick={onFooterClick}>
                <div className={cx(st.footerContent, { [st.isCollapsed]: isRoadCollapsed })} ref={footerContentRef}>
                    <div className={st.collapseSamples}>
                        <div className={cx(st.item, st.flex)}>
                            <div>
                                <DlFormItem className={st.formItem} label="Кол-во заказов">
                                    <DlInput value={props.amount_of_orders}
                                             disabled
                                             wrapperClass={st.input}
                                    />
                                </DlFormItem>
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

export default RoadItem