import st from "./ApplicationItemLab.module.css"
import { useEffect, useRef, useState } from "react";
import cx from "classnames";
import ApplicationsDocument from './ApplicationsDocument'
import ApplicationInfo from './ApplicationInfo'
import { useRouter } from "next/router";
import {
    convertDate,
    customizeStatusTag,
    getResultClassName,
    reportTypes,
    markersTableHeaders,
    sampleProtocolHeaders,
    STATUS_TAGS, STATUS, ROLE, makeAssignLoadingId,
} from "../../utils/utils";
import DlTable from "../Shared/Table";
import DlButton from "../Shared/Button";
import DlIcon from "../Shared/Icon";
import applicationActions from "../../actions/application";
import DomNotification from "../Shared/DomNotification";
import { useDispatch, useSelector } from "react-redux";
import QRScannerModal from "../Shared/QRScannerModal";
import { QR_CODE_MARKING_LENGTH } from "../../utils/constants";
import AssistantEditResult from "../Assistant/AssistantEditResult";
import AssistantsSelect from "../Assistant/AssistantsSelect";
import laboratoryActions from "../../actions/laboratoryActions";

const ApplicationItemLab = props => {
    const dispatch = useDispatch();
    const { push } = useRouter()
    const footerContentRef = useRef(null)

    // * STORE
    const { currentUser } = useSelector(state => state.user);
    const { applicationsList } = useSelector(state => state.application);
    const { assignLoadingId } = useSelector(state => state.laboratory);

    // * STATE
    const [isSubmitted, setIsSubmitted] = useState(props.is_results_submitted)
    const [isStatusChangedToAnalysis, setIsStatusChangedToAnalysis] = useState(props.status === STATUS.analysis)
    const [isSampleCollapsed, setIsSampleCollapsed] = useState(true)
    const [qrCodeScannerVisible, setQrCodeScannerVisible] = useState(false)
    const [loadingId, setLoadingId] = useState(null)

    // * COMPUTED
    const docLinks = [
        { title: "Заявка клиента", applicationId: props.id, reportType: reportTypes.application },
    ]
    if (props.is_sampling_report_submitted) {
        docLinks.unshift({ title: "Акт отбора проб", applicationId: props.id, reportType: reportTypes.act_of_samples })
    }
    const tag = customizeStatusTag(STATUS_TAGS.find(t => t.status === props.status), ROLE.laboratory)
    const { samples = [], markers = [] } = props;
    const protocolTableData = samples.map((sample, i) => {
        return {
            ...sample,
            index: i + 1,
            status: {
                time: sample.time,
                time_accepted: sample.time_accepted,
            }
        }
    })
    const markersTableData = markers.map((m, index) => {
        return {
            index: index + 1,
            norm_standard: m.norm_standard_title,
            ...m,
        }
    })

    const allSampleAccepted = samples.every(s => !!s.time_accepted)

    useEffect(() => {
        const content = footerContentRef.current
        if (content) {
            content.style.maxHeight = isSampleCollapsed ? `0px` : `${content.scrollHeight}px`;
        }
    }, [isSampleCollapsed])


    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const onAcceptSample = sample => {
        if (!isStatusChangedToAnalysis) {
            setIsStatusChangedToAnalysis(true)
            const obj = { status: STATUS.analysis }
            dispatch(applicationActions.updateApplicationStatus(obj, props.id, () => {
                DomNotification.success({ title: "Статус заявки успешно обновлён", showClose: true, duration: 1500 });
            }));
        }

        const sampleData = {
            id: sample.id,
            time_accepted: new Date().toISOString(),
            // result: ""
        }
        setLoadingId(sample.id)
        dispatch(applicationActions.acceptSampleLab(sampleData, () => {
            dispatch(applicationActions.getApplicationsList(() => setLoadingId(null), () => setLoadingId(null)))
        }))
    }

    const handleQrScanAcceptSample = (QRdata) => {
        if (!(typeof (QRdata) === "string" && QRdata.length === QR_CODE_MARKING_LENGTH && /^\d+$/.test(QRdata))) {
            return DomNotification.error({ title: "Неверный формат QR-кода!", showClose: true, duration: 5000 });
        }

        if (!isStatusChangedToAnalysis) {
            setIsStatusChangedToAnalysis(true)
            const obj = { status: STATUS.analysis }
            dispatch(applicationActions.updateApplicationStatus(obj, props.id, () => {
                DomNotification.success({ title: "Статус заявки успешно обновлён", showClose: true, duration: 5000 });
            }));
        }

        const QRCodeScanObj = {
            laboratory_id: currentUser.laboratory_id || -1,
            application_id: props.id,
            markings: [QRdata,]
        }

        dispatch(applicationActions.acceptSampleLabByMarking(QRCodeScanObj, (data) => {
            let acceptedMarkingsStr = data.accepted.join(', ')
            let notAcceptedMarkingsStr = data.not_accepted.join(', ')
            DomNotification.info({ title: `Если проба не принята, то проба не относится к Вашей лаборатории.`, showClose: true, duration: 5000 });
            DomNotification.success({ title: `Принятые пробы:\n${acceptedMarkingsStr}\n\nНе принятые пробы:\n${notAcceptedMarkingsStr}`, showClose: true, duration: 5000 });
            dispatch(applicationActions.getApplicationsList())
        }))
    }

    const onAddSampleResult = (value, result) => {
        console.log(`save value...`, value)
        console.log(`save result...`, result)
        // const errors = validateForm(result)
        // setFormErrors(errors)
        // if (errors && Object.keys(errors).length > 0) return
        const resultObj = {
            id: result.id,
            sample_id: result.sample && result.sample.id,
            value,
        }
        console.log(`resultObj`, resultObj)
        // dispatch(applicationActions.saveSampleResults(resultObj, afterSaveResults))
    }

    const handleSelectAssistant = (selectedOption, marker) => {
        // console.log(`marker`, marker)
        if (!selectedOption) {
            const obj = {
                application_id: props.id,
                marker_id: marker.id,
            }
            return dispatch(laboratoryActions.removeAssistant(obj, applicationsList, () => {
                DomNotification.success({ title: "Лаборант успешно снят с назначения, список заявок обновляется", showClose: true, duration: 2000 });
            }))
        }
        const { user } = selectedOption
        // console.log(`user`, user)
        const obj = {
            user,
            id: user.id,
            application_id: props.id,
            marker_id: marker.id,
        }
        // console.log(`obj`, obj)
        dispatch(laboratoryActions.assignAssistant(obj, applicationsList, () => {
            DomNotification.success({ title: "Назначенный лаборант успешно обновлён, список заявок обновляется", showClose: true, duration: 2000 });
        }))
    }

    return (
        <>
            <div
                className={cx(st.application)}
                onClick={() => push(`/applications/${props.id}`)}
            >
                <div className={cx(st.content, { [st.isDone]: props.status === STATUS.finished })}>
                    <div className={st.info}>
                        <ApplicationInfo
                            tag={tag}
                            dateTitle={`Поступила ${convertDate(props.created_at, { hours: true, format: 'dd MMMM в HH:mm' })}`}
                            numberTitle={`Заявка №${props.number}`}
                        />
                    </div>
                    <div className={cx(st.status, st.statusDone)}>
                        {docLinks.map((doc, i) => (
                            <div className={st.document} key={i}>
                                <ApplicationsDocument {...doc} linkText="Посмотреть" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={st.footer} onClick={onFooterClick}>
                    <div className={cx(st.footerContent, { [st.isCollapsed]: isSampleCollapsed })} ref={footerContentRef}>
                        <div className={st.collapseSamples}>
                            {allSampleAccepted ?
                                <div className={st.tableContainer}>
                                    <div className={st.bigger_subtitle}>Назначение лаборантов</div>
                                    <div className={st.table}>
                                        <DlTable
                                            headers={markersTableHeaders}
                                            tableData={markersTableData}
                                            marker={({ rowData }) => (<span>{rowData.marker.title}</span>)}
                                            assistant={({ rowData }) => (
                                                <AssistantsSelect
                                                    marker={rowData}
                                                    applicationId={props.id}
                                                    onSelectAssistant={(u) => handleSelectAssistant(u, rowData)}
                                                    isLoading={assignLoadingId === makeAssignLoadingId(props.id, rowData.id)}
                                                />
                                            )}
                                            value={({ rowData, rowIndex }) => (
                                                rowData.value ?
                                                    <span className={getResultClassName(rowIndex, markersTableData, st.isValSuccess, st.isValError)}>{rowData.value}</span>
                                                    :
                                                    <span className="edit">
                                                        <AssistantEditResult
                                                            onSave={(val) => onAddSampleResult(val, rowData)}
                                                            disabled={!rowData.sample}
                                                        />
                                                    </span>
                                            )}
                                        />
                                    </div>
                                </div>
                                :
                                <>
                                    {(samples && samples.length > 0) ?
                                        <div className={st.tableContainer}>
                                            <div className={st.bigger_subtitle}>Акт передачи проб</div>
                                            <div className={st.table}>
                                                <DlTable
                                                    headers={sampleProtocolHeaders}
                                                    tableData={protocolTableData}
                                                    status={({ rowData }) => (
                                                        <>
                                                            {rowData.time_accepted ?
                                                                convertDate(rowData.time_accepted, { format: "dd.LL.yyyy в HH:mm" })
                                                                :
                                                                !isSubmitted &&
                                                                <div>
                                                                    <DlButton
                                                                        type="primary"
                                                                        size="sm"
                                                                        loading={loadingId === rowData.id}
                                                                        onClick={() => onAcceptSample(rowData)}
                                                                    >
                                                                        Принять
                                                                    </DlButton>
                                                                </div>
                                                            }
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            {(!isSubmitted && samples && samples.length > 0) &&
                                                <DlButton type="primary" onClick={() => setQrCodeScannerVisible(true)}>
                                                    <DlIcon name="qr-code" />
                                                    <span>Сканировать QR-код</span>
                                                </DlButton>
                                            }
                                        </div>
                                        :
                                        <div className={st.no_applications_label}>Курьер ещё не добавил ни одной пробы</div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className={st.footerTitle} onClick={() => setIsSampleCollapsed(!isSampleCollapsed)}>
                        <span className={cx(st.footerIcon, { [st.iconCollapsed]: isSampleCollapsed })}>
                            <DlIcon name="keyboard_arrow_down" />
                        </span>
                        <span>{isSampleCollapsed ? 'Показать' : 'Скрыть'} подробности</span>
                        {/* <span>{isSampleCollapsed ? 'Показать' : 'Свернуть'} пробы ({samples && samples.length})</span> */}
                    </div>
                </div>
            </div>
            <QRScannerModal
                title="Сканировать QR-код"
                shouldCloseOnOverlayClick={false}
                visible={qrCodeScannerVisible}
                onScan={handleQrScanAcceptSample}
                onClose={() => setQrCodeScannerVisible(false)}
                onRequestClose={() => setQrCodeScannerVisible(false)}
            />
        </>
    )
}

export default ApplicationItemLab