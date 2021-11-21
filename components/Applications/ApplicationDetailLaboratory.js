import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
    convertDate,
    openBase64NewTab,
    getNormDisplayValue,
    reportTypes,
    schemaValidator,
    headersResults, sampleProtocolHeaders, headersMarkers, scrollToElement, getResultClassName, STATUS
} from "../../utils/utils";
import applicationActions from "../../actions/application";
import st from "./ApplicationDetail.module.css";
import DlBreadcrumb from "../Shared/Breadcrumb";
import DlFormItem from "../Shared/FormItem/FormItem";
import DlInput from "../Shared/Input";
import DlButton from "../Shared/Button";
import ApplicationsDocument from "./ApplicationsDocument";
import AlertCardSubtitle from "../Shared/AlertCardSubtitle";
import AlertCard from "../Shared/AlertCard";
import DomNotification from "../Shared/DomNotification";
import cx from "classnames"
import DlCollapse from "../Shared/Collapse";
import DlTable from "../Shared/Table";
import TableActions from "../Shared/TableActions";
import DlModal from "../Shared/Modal";
import LabResultSample from "../Samples/LabResultSample";
import { get as _get, isArray as _isArray } from 'lodash'
import ConfirmModal from "../Shared/ConfirmModal";
import DlIcon from "../Shared/Icon";
import {QR_CODE_MARKING_LENGTH} from "../../utils/constants";
import QRScannerModal from "../Shared/QRScannerModal";


const objSchema = {
    analyzers: [
        { required: 'Обязательное поле!' }
    ],
    drafter: [
        { required: 'Обязательное поле!' }
    ],
    lab_manager: [
        { required: 'Обязательное поле!' }
    ],
}

const getResultsTableData = (application) => {
    if (!application || !_isArray(application.results)) return []
    return application.results.map((item, index) => {
        return {
            index: index + 1,
            ...item,
            marking: _get(item, "sample.marking", "—"),
            unit: _get(item, "marker.unit", "—"),
            norm_standard: item.marker,
            norm: getNormDisplayValue(_get(item, "marker.norm_from"), _get(item, "marker.norm_to")),
        }
    })
}

const ApplicationDetailLaboratory = () => {
    const { push, query } = useRouter();
    const dispatch = useDispatch();
    const firstMain = useRef(null)

    // * STORE
    const { currentUser } = useSelector(state => state.user);

    const { application, applicationSamples, sampleLoader, confirmLoader } = useSelector(state => state.application);
    const applicationId = application && application.id;

    // * STATES
    const [applicationResearchObject, setApplicationResearchObject] = useState("");
    const [applicationAnalyzers, setApplicationAnalyzers] = useState("")
    const [applicationDrafter, setApplicationDrafter] = useState("")
    const [applicationLabManager, setApplicationLabManager] = useState("")
    const [applicantFirstName, setApplicantFirstName] = useState("");
    const [applicantLastName, setApplicantLastName] = useState("");
    const [applicantMiddleName, setApplicantMiddleName] = useState("");
    const [applicantPhone, setApplicantPhone] = useState("");
    const [applicantEmail, setApplicantEmail] = useState("");
    const [applicationAddress, setApplicationAddress] = useState("");
    const [applicantContract, setApplicantContract] = useState("");
    const [applicationMarkers, setApplicationMarkers] = useState([]);

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [resultModalVisible, setResultModalVisible] = useState(false)
    const [resultEdit, setResultEdit] = useState({})
    const [isStatusChangedToAnalysis, setIsStatusChangedToAnalysis] = useState(false)
    const [confirmModalVisible, setConfirmModalVisible] = useState(false)

    const [qrCodeScannerVisible, setQrCodeScannerVisible] = useState(false)
    const [mainElWidth, setMainElWidth] = useState(900)
    const [loadingId, setLoadingId] = useState(null)
    const [protocolErrors, setProtocolErrors] = useState({
        errors: {},
        isDirty: false
    })

    const [printProtocolText, setPrintProtocolText] = useState("Распечатать протокол")

    // * COMPUTED
    const docLinks = []
    if (applicationId) {
        docLinks.unshift({ title: `Заявка №${application.number}`, applicationId: applicationId, reportType: reportTypes.application })
    }
    if (applicationId && application.is_sampling_report_submitted) {
        docLinks.unshift({ title: `Акт отбора проб`, applicationId: applicationId, reportType: reportTypes.act_of_samples })
    }
    if (applicationId && application.is_results_submitted) {
        docLinks.unshift({ title: `Результаты исследования`, applicationId: applicationId, reportType: reportTypes.results })
    }

    const protocolTableData = applicationSamples.map((sample, i) => {
        return {
            ...sample,
            index: i + 1,
            status: {
                time: sample.time,
                time_accepted: sample.time_accepted,
            }
        }
    })

    const samplesOptions = applicationSamples.map(sample => {
        return {
            ...sample,
            value: sample.id,
            label: `${sample.marking} (${sample.place})`,
        }
    })

    const resultsTableData = getResultsTableData(application)

    // * HOOKS
    const validateForm = (scrollFlag) => {
        const obj = {
            analyzers: applicationAnalyzers && applicationAnalyzers.trim(),
            drafter: applicationDrafter && applicationDrafter.trim(),
            lab_manager: applicationLabManager && applicationLabManager.trim(),
        }
        const errors = schemaValidator(obj, objSchema);
        const isValid = !errors || Object.keys(errors).length === 0

        setProtocolErrors({ errors, isDirty: !isValid })
        if (Object.keys(errors).length > 0) {
            if (scrollFlag) {
                const firstName = Object.keys(errors)[0]
                // console.log(`firstName`, firstName)
                const el = document.querySelector(`[name="${firstName}"]`)
                // console.log(`el`, el)
                scrollToElement(el, -200)
            }
        }
        return isValid
        
    }

    useEffect(() => {
        if (protocolErrors.isDirty) validateForm()
    }, [protocolErrors.isDirty, applicationAnalyzers, applicationDrafter, applicationLabManager])

    useEffect(() => {
        const firstMainEl = firstMain.current;
        if (firstMainEl) {
            setMainElWidth(firstMainEl.offsetWidth)
        }
    }, [firstMain.current])

    useEffect(() => {
        if (query.pid) {
            dispatch(applicationActions.getApplicationById(query.pid));
            dispatch(applicationActions.getApplicationSamples(query.pid));
        }
    }, [query.pid])

    useEffect(() => {
        if (applicationId) {
            const { profile } = application
            setApplicationResearchObject(application.research_object.title)
            setApplicationAnalyzers(application.analyzers || "")
            setApplicationDrafter(application.drafter || "")
            setApplicationLabManager(application.lab_manager || "")
            setApplicantFirstName(profile.first_name)
            setApplicantLastName(profile.last_name)
            setApplicantMiddleName(profile.middle_name || "")
            setApplicantPhone(profile.phone)
            setApplicantEmail(profile.email)
            setApplicationAddress(application.address)
            setApplicantContract(profile.contract.toString())
            setApplicationMarkers(application.markers.map((item) => {
                return { id: item.id, indicator: item.title, standard: item.method_standard.title }
            }))
            setIsSubmitted(application.is_results_submitted)
            setIsStatusChangedToAnalysis(application.status === STATUS.analysis)
        }
    }, [applicationId])


    const beforeEdit = rowData => {
        setResultEdit(rowData)
        setResultModalVisible(true)
    }

    const saveChangesClicked = () => {
        const obj = {
            analyzers: applicationAnalyzers || null,
            drafter: applicationDrafter || null,
            lab_manager: applicationLabManager || null,
        }
        dispatch(applicationActions.updateApplicationLaboratory(obj, applicationId, () => {
            DomNotification.success({ title: "Заявка успешно обновлена", showClose: true, duration: 5000 });
        }));
    }

    const cancelChangesClicked = () => {
        push("/")
        DomNotification.info({ title: "Успешная отмена редактирования", showClose: true, duration: 5000 });
    }

    const submitResultsClicked = () => {
        setIsSubmitted(true)
        const obj = { is_results_submitted: true }
        dispatch(applicationActions.updateApplicationIsResultsSubmitted(obj, applicationId, () => {
            setConfirmModalVisible(false)
            DomNotification.success({ title: "Результаты успешно утверждёны", showClose: true, duration: 5000 });
        }));
    }

    const onAcceptSample = sample => {
        if (!isStatusChangedToAnalysis) {
            setIsStatusChangedToAnalysis(true)
            const obj = { status: STATUS.analysis }
            dispatch(applicationActions.updateApplicationStatus(obj, applicationId, () => {
                DomNotification.success({ title: "Статус заявки успешно обновлён", showClose: true, duration: 5000 });
            }));
        }
        const sampleData = {
            id: sample.id,
            time_accepted: new Date().toISOString(),
            // result: ""
        }
        setLoadingId(sample.id)
        dispatch(applicationActions.acceptSampleLab(sampleData, () => {
            dispatch(applicationActions.getApplicationSamples(applicationId, () => setLoadingId(null), () => setLoadingId(null)))
        }))
    }

    const handleResultModalClose = () => {
        setResultModalVisible(false)
        setResultEdit({})
    }

    const onAddSampleResult = () => {
        const resultObj = {
            id: resultEdit.id,
            sample_id: resultEdit.sample && resultEdit.sample.id,
            value: resultEdit.value,
        }
        dispatch(applicationActions.saveSampleResults(resultObj, afterSaveResults))
    }

    const afterSaveResults = () => {
        setResultModalVisible(false)
        setResultEdit({})
        dispatch(applicationActions.getApplicationById(applicationId))
        dispatch(applicationActions.getApplicationSamples(applicationId))
    }

    const handleQrScanAcceptSample = (QRdata) => {
        if (!(typeof(QRdata) === "string" && QRdata.length === QR_CODE_MARKING_LENGTH && /^\d+$/.test(QRdata))) {
            return DomNotification.error({ title: "Неверный формат QR-кода!", showClose: true, duration: 5000 });
        }

        if (!isStatusChangedToAnalysis) {
            setIsStatusChangedToAnalysis(true)
            const obj = { status: STATUS.analysis }
            dispatch(applicationActions.updateApplicationStatus(obj, applicationId, () => {
                DomNotification.success({ title: "Статус заявки успешно обновлён", showClose: true, duration: 5000 });
            }));
        }

        const QRCodeScanObj = {
            laboratory_id: currentUser.laboratory_id || -1,
            application_id: applicationId,
            markings: [QRdata, ]
        }

        dispatch(applicationActions.acceptSampleLabByMarking(QRCodeScanObj, (data) => {
            let acceptedMarkingsStr = data.accepted.join(', ')
            let notAcceptedMarkingsStr = data.not_accepted.join(', ')
            DomNotification.info({ title: `Если проба не принята, то проба не относится к Вашей лаборатории.`, showClose: true, duration: 5000 });
            DomNotification.success({ title: `Принятые пробы:\n${acceptedMarkingsStr}\n\nНе принятые пробы:\n${notAcceptedMarkingsStr}`, showClose: true, duration: 5000 });
            dispatch(applicationActions.getApplicationSamples(applicationId))
        }))
    }

    const beforeAcceptProtocol = () => {
        if (!application) return
        // console.log(`results`, application.results)
        // console.log(`samples`, application.samples)
        // const samplesCount = application.samples && application.samples.length
        const resultsCount = application.results && application.results.length
        const hasEmptyResults = resultsCount > 0 && application.results.filter(i => !i.value).length > 0
        if (hasEmptyResults) {
            const el = document.querySelector(`[name="results"]`)
            scrollToElement(el, 200)
            return DomNotification.error({
                title: `Добавьте все результаты до утверждения протокола!`,
                showClose: true,
                duration: 5000,
            });
        }
        if (!validateForm(true)) return
        setConfirmModalVisible(true)
    }

    const generateReportClicked = (report_type) => {
        setPrintProtocolText("Загрузка...")
        dispatch(applicationActions.generateReport(applicationId, report_type, (base64Data) => {
            openBase64NewTab(base64Data)
            setPrintProtocolText("Распечатать протокол")
        }))
    }

    return (
        <>
            {applicationId &&
                <div className={st.content}>
                    <div className={cx(st.container, st.containerFlex, st.containerWrap)}>
                        <div className={st.main} ref={firstMain}>
                            <DlBreadcrumb
                                currentIndex={2}
                                items={[
                                    { index: 1, title: "Заявки", path: '/' },
                                    { index: 2, title: `Заявка №${application.number}` },
                                ]}
                            />
                            <h1 className={st.title}>Заявка №{application.number}</h1>
                            <p className={st.lab_note}>Заполните протокол приема проб, а затем внесите свои результаты в таблицу результатов. Внимательно проверяйте введеные данные, в случае ошибки итоговый протокол можно подправить и распечатать заново.</p>
                            <div className={st.collapse_notes}>
                                <div className={st.collapse_note}>
                                    <DlCollapse title="Информация о заказе">
                                        <p className={st.bigger_subtitle}>Заявитель</p>
                                        <div className={st.client_info}>
                                            <DlFormItem className={st.form_mt} label="Полное наименование заявителя">
                                                <DlInput
                                                    disabled
                                                    value={applicantLastName + " " + applicantFirstName + " " + applicantMiddleName}
                                                />
                                            </DlFormItem>
                                            <div className={st.forms_inline}>
                                            <DlFormItem className={st.forms_inline_item} label="Номер телефона">
                                                    <DlInput
                                                        disabled
                                                        value={applicantPhone}
                                                    />
                                                </DlFormItem>
                                            <DlFormItem className={st.forms_inline_item} label="Адрес почты">
                                                    <DlInput
                                                        disabled
                                                        value={applicantEmail}
                                                    />
                                                </DlFormItem>
                                            </div>
                                            <DlFormItem className={st.form_mt} label="№ договора / № счета">
                                                <DlInput
                                                    disabled
                                                    value={applicantContract}
                                                />
                                            </DlFormItem>
                                            <DlFormItem className={st.form_mt} label="Адрес отбора проб">
                                                <DlInput
                                                    disabled
                                                    value={applicationAddress}
                                                />
                                            </DlFormItem>
                                        </div>
                                        <div className={st.markers_container}>
                                            <p className={st.bigger_subtitle}>Перечень показателей</p>
                                            <DlTable
                                                tableData={applicationMarkers}
                                                headers={headersMarkers}
                                            />
                                        </div>
                                    </DlCollapse>
                                </div>
                                <div className={st.collapse_note}>
                                    <DlCollapse title="Информация об объекте испытания">
                                        <p className={st.lab_note}>{applicationResearchObject}</p>
                                    </DlCollapse>
                                </div>
                            </div>
                        </div>
                        <div className={st.sidebar}>
                            <AlertCard type="info">
                                <AlertCardSubtitle>Документы на печать</AlertCardSubtitle>
                                {docLinks.map((doc, i) => (
                                    <div className={st.actsDoc} key={i}>
                                        <ApplicationsDocument {...doc} />
                                    </div>
                                ))}
                            </AlertCard>
                        </div>
                    </div>
                    <div className={st.container}>
                        <div className={st.main}>
                            <div className={st.tableContainer}>
                                <div className={st.bigger_subtitle}>Акт передачи проб</div>
                            {protocolTableData.length > 0 &&
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
                                                            <span>Принять</span>
                                                        </DlButton>
                                                    </div>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                            }
                                {(!isSubmitted
                                    && applicationSamples
                                    && applicationSamples.length > 0)
                                    && !applicationSamples.every(s => !!s.time_accepted)
                                    && <DlButton type="primary" onClick={() => setQrCodeScannerVisible(true)}><DlIcon name={"qr-code"} />Сканировать QR-код</DlButton>}
                            </div>
                            <div className={st.tableContainer}>
                                <div className={st.bigger_subtitle} name="results">Результаты</div>
                            {resultsTableData.length > 0 &&
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
                                            !isSubmitted &&
                                            <TableActions
                                                onEdit={() => beforeEdit(rowData)}
                                            />
                                        )}
                                    />
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                    <div className={st.container}>
                        <div className={st.main} style={{ maxWidth: mainElWidth }}>
                            <div className={st.application_details}>
                                <DlFormItem className={st.form_mt} label="Анализ проводил">
                                    <DlInput
                                        disabled={isSubmitted}
                                        placeholder="Анализ проводил..."
                                        value={applicationAnalyzers}
                                        onChange={ev => setApplicationAnalyzers(ev.target.value)}
                                        error={protocolErrors.errors.analyzers}
                                    />
                                </DlFormItem>
                                <DlFormItem className={st.form_mt} multiple label="Протокол составил">
                                    <DlInput
                                        disabled={isSubmitted}
                                        placeholder="Протокол составил..."
                                        value={applicationDrafter}
                                        onChange={ev => setApplicationDrafter(ev.target.value)}
                                        error={protocolErrors.errors.drafter}
                                    />
                                </DlFormItem>
                                <DlFormItem className={st.form_mt} multiple label="Заведующий лабораторией">
                                    <DlInput
                                        disabled={isSubmitted}
                                        placeholder="Заведующий лабораторией..."
                                        value={applicationLabManager}
                                        onChange={ev => setApplicationLabManager(ev.target.value)}
                                        error={protocolErrors.errors.lab_manager}
                                    />
                                </DlFormItem>
                            </div>
                        </div>
                    </div>
                    <div className={st.container}>
                        <div className={cx(st.main, st.mainFull, st.mainButtons)}>
                            <div className={st.actionButtons}>
                                {isSubmitted ?
                                    <div className={st.actionButton}>
                                        <DlButton fullWidth type="info" onClick={() => generateReportClicked(reportTypes.results)}>{printProtocolText}</DlButton>
                                    </div>
                                    :
                                    <>
                                        <div className={st.actionButton}>
                                            <DlButton fullWidth type="success" onClick={saveChangesClicked}>Сохранить изменения</DlButton>
                                        </div>
                                        <div className={st.actionButton}>
                                        <DlButton fullWidth type="info" onClick={beforeAcceptProtocol}>Утвердить протокол</DlButton>
                                        </div>
                                    </>
                                }
                                <div className={cx(st.actionButton, st.actionButtonLast)}>
                                    <DlButton fullWidth type="primary" outlined color="#969696" bgColor="transparent" onClick={cancelChangesClicked}>Отмена</DlButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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
            <ConfirmModal
                title="Утвердить протокол"
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onPositive={submitResultsClicked}
                saving={confirmLoader}
                saveType="success"
                saveText="Да, утвердить"
            >
                <p>Вы уверены что хотите утвердить протокол?</p>
            </ConfirmModal>
            <QRScannerModal
                title="Сканировать QR-код"
                shouldCloseOnOverlayClick={false}
                visible={qrCodeScannerVisible}
                onScan={(data) => handleQrScanAcceptSample(data)}
                onClose={() => setQrCodeScannerVisible(false)}
                onRequestClose={() => setQrCodeScannerVisible(false)}
            />
        </>
    )
}

export default ApplicationDetailLaboratory