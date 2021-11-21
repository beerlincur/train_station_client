import st from "./ApplicationItem.module.css"
import React from "react";
import cx from "classnames";
import ApplicationsDocument from './ApplicationsDocument'
import ApplicationsInfo from './ApplicationInfo'
import { useRouter } from "next/router";
import {convertDate, customizeStatusTag, reportTypes, ROLE, STATUS, STATUS_TAGS} from "../../utils/utils";
// import DlButton from "../Shared/Button";


const ApplicationItemCourier = props => {
    const { push } = useRouter()
    const tag = customizeStatusTag(STATUS_TAGS.find(t => t.status === props.status), ROLE.courier)
    const doc = { title: 'Заявка клиента', applicationId: props.id, reportType: reportTypes.application }

    // const getDirection = (ev, address) => {
    //     ev.stopPropagation()
    // }
    
    return (
        <div
            className={cx(st.application, st.isCourier, { [st.isDone]: props.status === STATUS.finished })}
            onClick={() => push(`/applications/${props.id}`)}
        >
            <div className={st.info}>
                <ApplicationsInfo
                    tag={tag}
                    dateTitle={`Поступила ${convertDate(props.created_at, { hours: true, format: 'dd MMMM в HH:mm' })}`}
                    numberTitle={`Заявка №${props.number}`}
                />
            </div>
            <div className={st.courierInfo}>
                <div className={cx(st.courierItem, st.document, st.docCourier)}>
                    <ApplicationsDocument {...doc} />
                </div>
                <div className={cx(st.courierItem, st.address)}>
                    <div className={st.addressTitle}>Приехать сюда:</div>
                    <p className={st.addressSubtitle}>{props.address}</p>
                </div>
                {/*{props.status === STATUS.to_client &&*/}
                {/*    <div className={cx(st.courierItem, st.button)}>*/}
                {/*        <DlButton onClick={getDirection} type="info" size="sm">Проложить маршут</DlButton>*/}
                {/*    </div>*/}
                {/*}*/}
            </div>
        </div>
    )
}

export default ApplicationItemCourier