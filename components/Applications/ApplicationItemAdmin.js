import st from "./ApplicationItem.module.css"
import cx from "classnames";
import ApplicationsDocument from './ApplicationsDocument'
import ApplicationsInfo from './ApplicationInfo'
import { useRouter } from "next/router";
import {convertDate, customizeStatusTag, reportTypes, ROLE, STATUS, STATUS_TAGS} from "../../utils/utils";
import DlIcon from "../Shared/Icon";
import DlButton from "../Shared/Button";

const ApplicationItemAdmin = props => {
    const { push } = useRouter()
    const tag = customizeStatusTag(STATUS_TAGS.find(t => t.status === props.status), ROLE.admin)
    const doc = { title: 'Заявка клиента', applicationId: props.id, reportType: reportTypes.application }

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
                    <div className={st.addressTitle}>Адрес отбора проб:</div>
                    <p className={st.addressSubtitle}>{props.address}</p>
                </div>
                <div className={cx(st.courierItem, st.courierSelector)}>

                    {props.courier ?
                        <div className={st.courier_choosen_chips}>
                            <DlIcon name="done" color="#00BA34" size={20} />
                            <span className={st.chipTitle}>Курьер выбран</span>
                        </div>
                        :
                        <div className={st.addButton}>
                            <DlButton type="courrier" size="sm">
                                Назначить курьера
                            </DlButton>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ApplicationItemAdmin