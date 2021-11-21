import st from "./ApplicationItemLab.module.css"
import cx from "classnames";
import ApplicationsDocument from './ApplicationsDocument'
import ApplicationInfo from './ApplicationInfo'
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
    convertDate,
    customizeStatusTag,
    getResultClassName,
    getResultsTableData,
    reportTypes,
    STATUS_TAGS,
    headersResults, ROLE, STATUS,
} from "../../utils/utils";
import DlTable from "../Shared/Table";
import DlIcon from "../Shared/Icon";
import applicationActions from "../../actions/application";
import { useDispatch, useSelector } from "react-redux";
import TableActions from "../Shared/TableActions";
import DlModal from "../Shared/Modal";
import LabResultSample from "../Samples/LabResultSample";
import DomNotification from "../Shared/DomNotification";

const ApplicationItemAssistant = props => {
    const footerContentRef = useRef(null)
    const { push } = useRouter()
    const dispatch = useDispatch();

    // * STORE
    const { sampleLoader } = useSelector(state => state.application);

    // * STATE
    const [isSampleCollapsed, setIsSampleCollapsed] = useState(true)
    const [loadingId, setLoadingId] = useState(null)
    const [resultEdit, setResultEdit] = useState({})
    const [resultModalVisible, setResultModalVisible] = useState(false)

    // * COMPUTED
    const docLinks = [
        { title: "Заявка клиента", applicationId: props.id, reportType: reportTypes.application },
    ]

    if (props.is_sampling_report_submitted) {
        docLinks.unshift({ title: "Акт отбора проб", applicationId: props.id, reportType: reportTypes.act_of_samples })
    }
    const tag = customizeStatusTag(STATUS_TAGS.find(t => t.status === props.status), ROLE.laboratory)
    const { samples = [] } = props;

    const samplesOptions = samples.map(sample => {
        return {
            ...sample,
            value: sample.id,
            label: `${sample.marking} (${sample.place})`,
        }
    })
    const resultsTableData = getResultsTableData(props)

    // * HOOKS
    useEffect(() => {
        const content = footerContentRef.current
        if (content) {
            content.style.maxHeight = isSampleCollapsed ? `0px` : `${content.scrollHeight}px`;
        }
    }, [isSampleCollapsed])

    // * METHODS
    const onFooterClick = ev => {
        ev.stopPropagation()
    }

    const onAddSampleResult = () => {
        const resultObj = {
            id: resultEdit.id,
            sample_id: resultEdit.sample && resultEdit.sample.id,
            value: resultEdit.value,
        }
        setLoadingId(resultEdit.id)
        dispatch(applicationActions.saveSampleResults(resultObj, afterSaveResults))
    }

    const afterSaveResults = () => {
        setResultModalVisible(false)
        setResultEdit({})
        DomNotification.success({title: "Результат успешно обновлён, список заявок обновляется", showClose: true, duration: 5000});
        dispatch(applicationActions.getApplicationsList(() => {
            setLoadingId(null)
        }));
    }

    const beforeEdit = rowData => {
        dispatch(applicationActions.getApplicationSamples(props.id));
        setResultEdit(rowData)
        setResultModalVisible(true)
    }

    const handleResultModalClose = () => {
        setResultModalVisible(false)
        setResultEdit({})
    }

    return (
        <>
            <div
                className={cx(st.application)}
                // onClick={() => push(`/applications/${props.id}`)}
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
                            <div className={st.tableContainer}>
                                <div className={st.bigger_subtitle}>Результаты</div>
                                {!samples || samples.length < 1 ? <div className={st.no_applications_label}>Курьер ещё не добавил ни одной пробы</div> : <></>}
                                <div className={st.table}>
                                    <DlTable
                                        headers={headersResults}
                                        tableData={resultsTableData}
                                        marker={({ rowData }) => (<span>{rowData.marker.title}</span>)}
                                        norm_standard={({ rowData }) => (<span>{rowData.norm_standard.norm_standard.title}</span>)}
                                        value={({ rowData, rowIndex }) => (
                                            <span className={getResultClassName(rowIndex, resultsTableData, st.isValSuccess, st.isValError)}>{rowData.value || "—"}</span>
                                        )}
                                        actions={({ rowData }) => (
                                            !props.is_results_submitted &&
                                            <TableActions
                                                onEdit={() => beforeEdit(rowData)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={st.footerTitle} onClick={() => setIsSampleCollapsed(!isSampleCollapsed)}>
                        <span className={cx(st.footerIcon, { [st.iconCollapsed]: isSampleCollapsed })}>
                            <DlIcon name="keyboard_arrow_down" />
                        </span>
                        <span>{isSampleCollapsed ? 'Показать' : 'Скрыть'} подробности</span>
                    </div>
                </div>
            </div>
            <DlModal
                title="Добавить результат"
                shouldCloseOnOverlayClick={false}
                visible={resultModalVisible}
                onRequestClose={handleResultModalClose}
                onSave={onAddSampleResult}
                saving={sampleLoader}
            >
                <LabResultSample
                    result={resultEdit}
                    onChange={val => setResultEdit(val)}
                    samplesOptions={samplesOptions}
                />
            </DlModal>
        </>
    )
}

export default ApplicationItemAssistant