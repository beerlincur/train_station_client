import st from "./ApplicationDetail.module.css";
import DlFormItem from "../Shared/FormItem/FormItem";
import DlInput from "../Shared/Input";
import React, { useEffect, useRef, useState } from "react";
import applicationActions from "../../actions/application";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import DlButton from "../Shared/Button";
import DlTable from "../Shared/Table";
import TableActions from "../Shared/TableActions";
import DlCollapse from "../Shared/Collapse";
import DlTextarea from "../Shared/Textarea";
import cx from "classnames";
import ApplicationsDocument from "./ApplicationsDocument";
import AlertCardSubtitle from "../Shared/AlertCardSubtitle";
import AlertCardSupertitle from "../Shared/AlertCardSupertitle";
import AlertCard from "../Shared/AlertCard";
import AlertCardTitle from "../Shared/AlertCardTitle";
import DomNotification from "../Shared/DomNotification";
import DlBreadcrumb from "../Shared/Breadcrumb";
import DlModal from "../Shared/Modal";
import CourierAddSample from "../Samples/CourierAddSample";
import {
    convertDate, headersMarkers, methodOptions,
    openBase64NewTab, paymentType, paymentTypeToWord,
    reportTypes, sampleHeaders,
    sampleSchema, samplingType,
    schemaValidator,
    scrollToElement, typeOptions
} from "../../utils/utils";
import ConfirmModal from "../Shared/ConfirmModal";
import QRScannerModal from "../Shared/QRScannerModal";
import { QR_CODE_MARKING_LENGTH } from "../../utils/constants";

const actSchema = {
    address: [
        { required: 'Обязательное поле!' }
    ],
    samples_taking_conditions: [
        { required: 'Обязательное поле!' }
    ],
    samples_inspection_result: [
        { required: 'Обязательное поле!' }
    ],
    samples_storage_conditions: [
        { required: 'Обязательное поле!' }
    ],
}

const samplingTypeToWords = {
    customer: "Клиент производит отбор и доставку проб в центр самостоятельно. Вам нужно доставить пробы в лабораторию",
    courier: "Вам нужно произвести отбор и доставить пробы в центр",
    customer_samples: "Клиент производит отбор проб. Вам нужно доставить пробы в центр"
};


const ApplicationDetailCourier = () => {
    const firstMain = useRef(null)
    const { push, query } = useRouter();
    const dispatch = useDispatch();

    // * STORE
    const { application, applicationSamples, sampleLoader, confirmLoader, loader } = useSelector(state => state.application);

    // * STATE
    const [applicationResearchObject, setApplicationResearchObject] = useState("");
    const [applicationMarkers, setApplicationMarkers] = useState([]);
    const [applicantFirstName, setApplicantFirstName] = useState("");
    const [applicantLastName, setApplicantLastName] = useState("");
    const [applicantMiddleName, setApplicantMiddleName] = useState("");
    const [applicantPhone, setApplicantPhone] = useState("");
    const [applicantEmail, setApplicantEmail] = useState("");
    const [applicationAddress, setApplicationAddress] = useState("");
    const [applicantContract, setApplicantContract] = useState("");
    const [applicationPrice, setApplicationPrice] = useState(0);
    const [applicationPeriod, setApplicationPeriod] = useState(0);
    const [applicationPayment, setApplicationPayment] = useState(paymentType.card);
    const [applicationSampling, setApplicationSampling] = useState(samplingType.courier);

    const [applicationROStandard, setApplicationROStandard] = useState("");
    const [applicationSamplesStandard, setApplicationSamplesStandard] = useState("");

    const [applicationIdentificationSigns, setApplicationIdentificationSigns] = useState("");
    const [applicationSamplesConditions, setApplicationSamplesConditions] = useState("");
    const [applicationSamplesInspectionResult, setApplicationSamplesInspectionResult] = useState("");
    const [applicationSamplesStorageConditions, setApplicationSamplesStorageConditions] = useState("");
    const [applicationCouriersComments, setApplicationCouriersComments] = useState("");
    const [applicationSampleResultSubmittedDate, setApplicationSampleResultSubmittedDate] = useState("");
    const [applicationSampleResultSubmittedTime, setApplicationSampleResultSubmittedTime] = useState("");

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [sampleModalVisible, setSampleModalVisible] = useState(false)
    const [sampleState, setSampleState] = useState({})
    const [deleteModal, setDeleteModal] = useState(false)
    const [sampleDelete, setSampleDelete] = useState(null)
    const [confirmModalVisible, setConfirmModalVisible] = useState(false)

    const [qrCodeScannerVisible, setQrCodeScannerVisible] = useState(false)
    const [mainElWidth, setMainElWidth] = useState(900)
    const [sampleErrors, setSampleErrors] = useState({
        isDirty: false,
        errors: {}
    })
    const [actErrors, setActErrors] = useState({
        isDirty: false,
        errors: {}
    })

    const [printProtocolText, setPrintProtocolText] = useState("Распечатать акт отбора")

    // * COMPUTED
    const applicationId = application && application.id;
    const SAMPLE_INITIAL_STATE = {
        application_id: applicationId,
        // marker_id: application.research_object && application.research_object.id,
        marker_id: 2, // ! todo: remove this
    }

    const docLinks = []
    if (applicationId) {
        docLinks.unshift({ title: `Заявка №${application.number}`, applicationId: applicationId, reportType: reportTypes.application })
    }
    if (applicationId && application.is_sampling_report_submitted) {
        docLinks.unshift({ title: `Акт отбора проб`, applicationId: applicationId, reportType: reportTypes.act_of_samples })
    }
    const applicationSamplesData = applicationSamples.map((s, i) => ({ ...s, index: i + 1 }))

    // * HOOKS
    const validateForm = (scrollFlag) => {
        let isValid = true;
        const obj = {
            identification_signs: applicationIdentificationSigns,
            address: applicationAddress,
            samples_taking_conditions: applicationSamplesConditions,
            samples_inspection_result: applicationSamplesInspectionResult,
            samples_storage_conditions: applicationSamplesStorageConditions,
            couriers_comment: applicationCouriersComments,
        }
        const errors = schemaValidator(obj, actSchema);
        setActErrors({ isDirty: true, errors });
        if (Object.keys(errors).length > 0) {
            isValid = false;
            if (scrollFlag) {
                const firstName = Object.keys(errors)[0]
                const el = document.querySelector(`[name="${firstName}"]`)
                scrollToElement(el)
            }
        }
        return isValid;
    }

    const validateSampleForm = () => {
        const { method, type, unit, ...rest } = sampleState
        const obj = {
            ...rest,
            time: new Date().toISOString(),
            method: method && method.value,
            type: type && type.value,
            unit: unit && unit.value,
        }
        const errors = schemaValidator(obj, sampleSchema);
        const isValid = !errors || Object.keys(errors).length === 0
        setSampleErrors({ isDirty: !isValid, errors })
        return isValid
    }

    useEffect(() => {
        if (actErrors.isDirty) validateForm()
    }, [actErrors.isDirty, applicationIdentificationSigns, applicationAddress, applicationSamplesConditions, applicationSamplesInspectionResult, applicationSamplesStorageConditions, applicationCouriersComments])
    
    const { marking, place, volume, sample_container } = sampleState
    useEffect(() => {
        if (sampleErrors.isDirty) validateSampleForm()
    }, [sampleErrors.isDirty, marking, place, volume, sample_container])
    
    // set container main width
    useEffect(() => {
        const firstMainEl = firstMain.current;
        if (firstMainEl) {
            setMainElWidth(firstMainEl.offsetWidth)
        }
    }, [firstMain.current])

    useEffect(() => {
        if (applicationId) {
            const { profile } = application
            setApplicationResearchObject(application.research_object.title)
            setApplicationMarkers(application.markers.map((item, i) => {
                return { index: i + 1, id: item.id, indicator: item.title, standard: item.method_standard.title }
            }))
            setApplicantFirstName(profile.first_name)
            setApplicantLastName(profile.last_name)
            setApplicantMiddleName(profile.middle_name || "")
            setApplicantPhone(profile.phone)
            setApplicantEmail(profile.email)
            setApplicationAddress(application.address)
            setApplicantContract(profile.contract.toString())
            setApplicationPrice(application.price)
            setApplicationPeriod(application.period)
            setApplicationPayment(application.payment)
            setApplicationSampling(application.sampling)

            setApplicationROStandard(application.research_object.standard.title)
            setApplicationSamplesStandard(application.research_object.standard.title)

            setApplicationIdentificationSigns(application.identification_signs || "")
            setApplicationSamplesConditions(application.samples_taking_conditions || "")
            setApplicationSamplesInspectionResult(application.samples_inspection_result || "")
            setApplicationSamplesStorageConditions(application.samples_storage_conditions || "")
            setApplicationCouriersComments(application.couriers_comment || "")
            setApplicationSampleResultSubmittedDate(application.sampling_report_submit_time
                ? convertDate(application.sampling_report_submit_time, { format: 'dd LLL yyyy' })
                : "Утвердите акт отбора")
            setApplicationSampleResultSubmittedTime(application.sampling_report_submit_time
                ? convertDate(application.sampling_report_submit_time, { format: 'HH:mm' })
                : "Утвердите акт отбора")

            setIsSubmitted(application.is_sampling_report_submitted)
            setSampleState({
                ...sampleState,
                ...SAMPLE_INITIAL_STATE,
            })
        }
    }, [application])

    useEffect(() => {
        if (query.pid) {
            dispatch(applicationActions.getApplicationById(query.pid));
            dispatch(applicationActions.getApplicationSamples(query.pid));
        }
    }, [query.pid])

    const handleSampleModalClose = () => {
        setSampleState(SAMPLE_INITIAL_STATE)
        setSampleModalVisible(false)
        setSampleErrors({ isDirty: false, errors: {} })
    }

    const beforeSampleEdit = rowData => {
        setSampleState({
            ...rowData,
            marker_id: rowData.marker && rowData.marker.id,
            method: rowData.method && (methodOptions.find(m => m.value === rowData.method) || {}),
            type: rowData.type && (typeOptions.find(m => m.value === rowData.type) || {}),
        })
        setSampleModalVisible(true)
    }
    const beforeDelete = rowData => {
        setSampleDelete(rowData)
        setDeleteModal(true)
    }

    const onDeleteSample = () => {
        if (!sampleDelete) return
        dispatch(applicationActions.deleteApplicationSample(sampleDelete, () => {
            setSampleDelete(null)
            setDeleteModal(false)
        }))
    }

    const saveChangesClicked = () => {
        const obj = {
            address: applicationAddress || null,
            couriers_comment: applicationCouriersComments || null,
            samples_inspection_result: applicationSamplesInspectionResult || null,
            samples_storage_conditions: applicationSamplesStorageConditions || null,
            samples_taking_conditions: applicationSamplesConditions || null,
            inspection_doc: null,
            sampling_result: null,
            identification_signs: applicationIdentificationSigns || null
        }
        dispatch(applicationActions.updateApplicationCourier(obj, applicationId, () => {
            DomNotification.success({ title: "Заявка успешно обновлена", showClose: true, duration: 5000 });
        }));
    }

    const cancelChangesClicked = () => {
        push("/")
        DomNotification.info({ title: "Успешная отмена редактирования", showClose: true, duration: 5000 });
    }

    const beforeConfirmAct = () => {
        if (applicationSamples.length <= 0) {
            const el = document.querySelector(`[name="samplesList"]`)
            DomNotification.error({ title: "Сначало добавьте пробы!", showClose: true });
            return scrollToElement(el, 200)
        }
        const isValid = validateForm(true)
        if (!isValid) return
        setConfirmModalVisible(true);
    }

    const submitProtocolClicked = () => {
        setIsSubmitted(true)
        const obj = { is_sampling_report_submitted: true }
        dispatch(applicationActions.updateApplicationIsSamplingReportSubmitted(obj, applicationId, () => {
            setConfirmModalVisible(false)
            dispatch(applicationActions.getApplicationById(query.pid));
            DomNotification.success({ title: "Акт отбора успешно утверждён", showClose: true, duration: 5000 });
        }));
    }

    const handleSaveSample = () => {
        const { method, type, unit, ...rest } = sampleState
        const obj = {
            ...rest,
            time: new Date().toISOString(),
            method: method && method.value,
            type: type && type.value,
            unit: unit && unit.value,
        }
        if (!validateSampleForm()) return
        // console.log(`errors: `, sampleErrors)
        if (obj.id) {
            dispatch(applicationActions.updateSampleCourier(obj, afterSaveSample))
        } else {
            dispatch(applicationActions.createNewSample(obj, afterSaveSample))
        }
    }

    const afterSaveSample = () => {
        setSampleState(SAMPLE_INITIAL_STATE)
        setSampleModalVisible(false)
        dispatch(applicationActions.getApplicationSamples(applicationId))
    }

    const handleQrScanConnectMarking = (QRdata) => {
        if (!(typeof (QRdata) === "string" && QRdata.length === QR_CODE_MARKING_LENGTH && /^\d+$/.test(QRdata))) {
            return DomNotification.error({ title: "Неверный формат QR-кода!", showClose: true, delay: 500 });
        }

        const SAMPLE_STATE_W_MARKING = {
            place: sampleState.place || "",
            marking: QRdata || "",
            volume: sampleState.volume || "",
            sample_container: sampleState.sample_container || "",
            preparation: sampleState.preparation || "",
        }

        setSampleState({
            ...sampleState,
            ...SAMPLE_STATE_W_MARKING,
        })

        setQrCodeScannerVisible(false)
        setSampleModalVisible(true)

        DomNotification.success({ title: "Маркировка успешно отсканирована", showClose: true, duration: 5000 });
    }

    const generateReportClicked = (report_type) => {
        setPrintProtocolText("Загрузка...")
        dispatch(applicationActions.generateReport(applicationId, report_type, (base64Data) => {
            openBase64NewTab(base64Data)
            setPrintProtocolText("Распечатать акт отбора")
        }))
    }

    return (
        <>
            {applicationId &&
                <div className={st.content}>
                    <div className={cx(st.container, st.containerFlex, st.containerWrap, st.padding_bottom_48)}>
                        <div className={st.main} ref={firstMain}>
                            <DlBreadcrumb
                                currentIndex={2}
                                items={[
                                    { index: 1, title: "Заявки", path: '/' },
                                    { index: 2, title: `Заявка №${application.number}` }
                                ]}
                            />
                            <h1 className={st.title}>Заявка №{application.number}</h1>
                            <p className={st.subtitle}>Произведите отбор проб и заполните акт отбора для последующей передачи
                                в лабораторию.</p>
                            <div className={st.collapse_div}>
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
                                                    type={"tel"}
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
                                                type={"tel"}
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
                                        <div className={st.markers_table}>
                                            {applicationMarkers.length > 0 &&
                                                <DlTable
                                                    tableData={applicationMarkers}
                                                    headers={headersMarkers}
                                                />
                                            }
                                        </div>
                                    </div>
                                </DlCollapse>
                            </div>
                            <div className={st.act_of_samples}>
                                <p className={st.bigger_subtitle}>Акт отбора проб</p>
                                {application &&
                                    <div className={st.forms_inline}>
                                        <DlFormItem className={st.forms_inline_item} label="Дата отбора">
                                            <DlInput
                                                disabled
                                                value={applicationSampleResultSubmittedDate}
                                            />
                                        </DlFormItem>
                                        <DlFormItem className={st.forms_inline_item} label="Время отбора">
                                            <DlInput
                                                disabled
                                                value={applicationSampleResultSubmittedTime}
                                            />
                                        </DlFormItem>
                                    </div>
                                }
                                <DlFormItem className={st.form_mt} label="Стандарт на объект испытаний">
                                    <DlInput
                                        disabled
                                        value={applicationROStandard}
                                    />
                                </DlFormItem>
                                <DlFormItem className={st.form_mt} label="Стандарт на метод отбора проб">
                                    <DlInput
                                        disabled
                                        value={applicationSamplesStandard}
                                    />
                                </DlFormItem>
                                <div name="identification_signs" style={{ visibility: "none", height: 0 }} />
                                <DlFormItem className={st.form_mt} label="Идентификационные признаки (размер партии, дата изготовления)">
                                    <DlInput
                                        disabled={isSubmitted}
                                        value={applicationIdentificationSigns}
                                        onChange={ev => setApplicationIdentificationSigns(ev.target.value)}
                                        placeholder="Введите идентификационные признаки..."
                                        error={actErrors.errors.identification_signs}
                                    />
                                </DlFormItem>
                                <div name="address" style={{ visibility: "none", height: 0 }} />
                                <DlFormItem className={st.form_mt} label="Адрес отбора проб">
                                    <DlInput
                                        disabled
                                        value={applicationAddress}
                                        placeholder="Введите адрес отбора проб..."
                                        error={actErrors.errors.address}
                                        />
                                </DlFormItem>
                                <div name="samples_taking_conditions" style={{ visibility: "none", height: 0 }} />
                                <DlFormItem className={st.form_mt} label="Условия отбора">
                                    <DlInput
                                        disabled={isSubmitted}
                                        value={applicationSamplesConditions}
                                        onChange={ev => setApplicationSamplesConditions(ev.target.value)}
                                        placeholder="Введите условия отбора..."
                                        error={actErrors.errors.samples_taking_conditions}
                                    />
                                </DlFormItem>
                            </div>
                        </div>
                        <div className={st.sidebar}>
                            <AlertCard type="info">
                                <AlertCardSubtitle>Что забираем:</AlertCardSubtitle>
                                <AlertCardTitle>{applicationResearchObject}</AlertCardTitle>
                            </AlertCard>
                            <AlertCard type="warning">
                                <AlertCardSubtitle>Тип оплаты:</AlertCardSubtitle>
                                <AlertCardTitle>{paymentTypeToWord[applicationPayment]}</AlertCardTitle>
                                <AlertCardSupertitle>{applicationPrice} ₽</AlertCardSupertitle>
                            </AlertCard>
                            <AlertCard type="warning">
                                <AlertCardSubtitle>Отбор и доставка роб:</AlertCardSubtitle>
                                <AlertCardSupertitle>{samplingTypeToWords[applicationSampling]}</AlertCardSupertitle>
                            </AlertCard>
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
                    <div className={cx(st.container, st.padding_bottom_48)}>
                        <div className={st.markers_container}>
                            <div className={st.samples_title_w_tutor}>
                                <p className={st.bigger_subtitle}>Пробы</p>
                                {/*<a className={st.sample_tutor_link} href="#">Инструкция отбора проб</a>*/}
                            </div>
                            <div name="samplesList" style={{ visibility: "hidden", height: 0 }} />
                            {applicationSamplesData.length > 0 &&
                                <div className={st.sampleTable}>
                                    <DlTable
                                        tableData={applicationSamplesData}
                                        headers={sampleHeaders}
                                        rowClassName={(__, row) => {
                                            return row.isDeleted ? st.rowDeleted : ""
                                        }}
                                        time={({ rowData }) => (
                                            <span>{convertDate(rowData.time, { format: "dd.LL.yyyy в HH:mm" })}</span>
                                        )}
                                        method={({ rowData }) => (
                                            <span>{(methodOptions.find(m => m.value === rowData.method) || {}).label || "-"}</span>
                                        )}
                                        type={({ rowData }) => (
                                            <span>{(typeOptions.find(m => m.value === rowData.type) || {}).label || "-"}</span>
                                        )}
                                        preparation={({ rowData }) => (
                                            <span>{rowData.preparation || "-"}</span>
                                        )}
                                        actions={({ rowData }) => (
                                            !isSubmitted &&
                                            <TableActions
                                                onEdit={() => beforeSampleEdit(rowData)}
                                                onDelete={() => beforeDelete(rowData)}
                                            />
                                        )}
                                    />
                                </div>
                            }
                            <div className={st.sampleAddButton}>
                                {!isSubmitted &&
                                    <DlButton type="primary" onClick={() => setSampleModalVisible(true)}>
                                        <span>Добавить пробу</span>
                                    </DlButton>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={st.container}>
                        <div className={st.main} style={{ maxWidth: mainElWidth }}>
                            <div className={st.application_details}>
                                <div name="samples_inspection_result" style={{ visibility: "none", height: 0 }} />
                                <DlFormItem label="Результат осмотра проб">
                                    <DlInput
                                        disabled={isSubmitted}
                                        value={applicationSamplesInspectionResult}
                                        onChange={ev => setApplicationSamplesInspectionResult(ev.target.value)}
                                        placeholder="Введите результат осмотра проб..."
                                        error={actErrors.errors.samples_inspection_result}
                                    />
                                </DlFormItem>
                                <div name="samples_storage_conditions" style={{ visibility: "none", height: 0 }} />
                                <DlFormItem className={st.form_mt} label="Условия и место хранения проб">
                                    <DlInput
                                        disabled={isSubmitted}
                                        value={applicationSamplesStorageConditions}
                                        onChange={ev => setApplicationSamplesStorageConditions(ev.target.value)}
                                        placeholder="Введите условия и место хранения проб..."
                                        error={actErrors.errors.samples_storage_conditions}
                                    />
                                </DlFormItem>
                                <div name="couriers_comment" style={{ visibility: "none", height: 0 }} />
                                <DlFormItem className={st.form_mt} label="Примечания">
                                    <DlTextarea
                                        disabled={isSubmitted}
                                        value={applicationCouriersComments}
                                        onChange={ev => setApplicationCouriersComments(ev.target.value)}
                                        placeholder="Введите примечания..."
                                        error={actErrors.errors.couriers_comment}
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
                                        <DlButton fullWidth type="info" onClick={() => generateReportClicked(reportTypes.act_of_samples)}>{printProtocolText}</DlButton>
                                    </div>
                                    :
                                    <>
                                        <div className={st.actionButton}>
                                            <DlButton fullWidth type="success" onClick={saveChangesClicked} loading={loader}>Сохранить изменения</DlButton>
                                        </div>
                                        <div className={st.actionButton}>
                                            <DlButton fullWidth type="info" onClick={beforeConfirmAct}>Утвердить акт отбора</DlButton>
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
            {sampleModalVisible &&
                <DlModal
                    title="Добавить пробу"
                    visible={sampleModalVisible}
                    onRequestClose={handleSampleModalClose}
                    onSave={handleSaveSample}
                    saving={sampleLoader}
                >
                    <CourierAddSample
                        errors={sampleErrors.errors}
                        value={sampleState}
                        onChange={val => setSampleState(val)}
                        typeOptions={typeOptions}
                        methodOptions={methodOptions}
                        onScanClicked={() => setQrCodeScannerVisible(true)}
                    />
                </DlModal>
            }
            <ConfirmModal
                title="Удаление пробы!"
                visible={deleteModal}
                onClose={() => setDeleteModal(false)}
                onPositive={onDeleteSample}
                saving={sampleLoader}
            >
                <p>Вы уверены, что хотите удалить пробу?</p>
            </ConfirmModal>
            <ConfirmModal
                title="Утвердить акт отбора"
                visible={confirmModalVisible}
                onClose={() => setConfirmModalVisible(false)}
                onPositive={submitProtocolClicked}
                saving={confirmLoader}
                saveType="success"
                saveText="Да, утвердить"
            >
                <p>Вы уверены, что хотите утвердить акт отбора?</p>
            </ConfirmModal>
            <QRScannerModal
                title="Сканировать QR-код"
                shouldCloseOnOverlayClick={false}
                visible={qrCodeScannerVisible}
                onScan={(data) => handleQrScanConnectMarking(data)}
                onClose={() => setQrCodeScannerVisible(false)}
                onRequestClose={() => setQrCodeScannerVisible(false)}
            />
        </>
    )
}


export default ApplicationDetailCourier
