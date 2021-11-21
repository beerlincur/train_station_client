import st from "./ApplicationItem.module.css"
import React from "react";
import cx from "classnames";
import ApplicationsProgressIcons from './ApplicationsProgressIcons'
import ApplicationsDocument from './ApplicationsDocument'
import ApplicationInfo from './ApplicationInfo'
import { useRouter } from "next/router";
import {convertDate, reportTypes, STATUS, STATUS_TAGS} from "../../utils/utils";


const ApplicationItem = props => {
    const { push } = useRouter()
    const tag = STATUS_TAGS.find(t => t.status === props.status)
    const docLinks = [
        { title: `Акт отбора проб`, applicationId: props.id, reportType: reportTypes.act_of_samples },
        { title: `Результаты исследования`, applicationId: props.id, reportType: reportTypes.results }
    ]
    
    return (
        <div
            className={cx(st.application, { [st.isDone]: props.status === STATUS.finished })}
            onClick={() => push(`/applications/${props.id}`)}
        >
            <div className={st.info}>
                <ApplicationInfo
                    tag={tag}
                    dateTitle={`Принята ${convertDate(props.created_at, { hours: true, format: 'dd MMMM в HH:mm' })}`}
                    numberTitle={`Заявка №${props.number}`}
                />
            </div>
            {props.status === STATUS.finished ?
                <div className={cx(st.status, st.statusDone)}>
                    {docLinks.map((doc, i) => (
                        <div className={st.document} key={i}>
                            <ApplicationsDocument {...doc} />
                        </div>
                    ))}
                </div>
                :
                <div className={st.status}>
                    <ApplicationsProgressIcons status={props.status} />
                </div>
            }
        </div>
    )
}

export default ApplicationItem