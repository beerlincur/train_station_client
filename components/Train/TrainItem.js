import st from "./TrainItem.module.css"
import React, {useRef, useState} from "react";
import cx from "classnames";
import TicketInfo from "../Ticket/TicketInfo";
import {convertDate} from "../../utils/utils";
import DlTable from "../Shared/Table";
import DlIcon from "../Shared/Icon";

const carsHeaders = [
    { name: "index", label: "№", width: "50px" },
    { name: "number", label: "Номер вагона"},
    { name: "type", label: "Тип вагона"},
    { name: "amOfSeats", label: "Кол-во мест" },
];

const TrainItem = props => {

    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const footerContentRef = useRef(null)

    const [isRoadCollapsed, setIsRoadCollapsed] = useState(true)

    const tag = {
        color: 'success',
        label: "Активен",
        dark: false,
    }

    const carsTableData = props.cars.map((car, i) => {
        return {
            index: i + 1,
            number: car.number,
            type: car.type.name,
            amOfSeats: car.type.amount_of_seats
        }
    })

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
            <div className={st.footer} onClick={onFooterClick}>
                <div className={cx(st.footerContent, { [st.isCollapsed]: isRoadCollapsed })} ref={footerContentRef}>
                    <div className={st.collapseSamples}>
                        <div className={st.tableContainer}>
                            <div className={st.bigger_subtitle}>Вагоны поезда</div>
                            <div className={st.table}>
                                <DlTable
                                    headers={carsHeaders}
                                    tableData={carsTableData}
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

export default TrainItem