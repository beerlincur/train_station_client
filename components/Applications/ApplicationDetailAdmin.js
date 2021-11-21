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
import DlTextarea from "../Shared/Textarea";
import cx from "classnames";
import ApplicationsDocument from "./ApplicationsDocument";
import AlertCardSubtitle from "../Shared/AlertCardSubtitle";
import AlertCardSupertitle from "../Shared/AlertCardSupertitle";
import AlertCard from "../Shared/AlertCard";
import AlertCardTitle from "../Shared/AlertCardTitle";
import DomNotification from "../Shared/DomNotification";
import DlBreadcrumb from "../Shared/Breadcrumb";
import {
    convertDate,
    customizeStatusTag,
    getNormDisplayValue,
    getResultClassName,
    headersMarkers,
    headersResults,
    methodOptions,
    paymentType,
    paymentTypeToWord,
    reportTypes, ROLE,
    sampleHeaders,
    sampleProtocolHeaders,
    sampleSchema,
    samplingType,
    schemaValidator,
    scrollToElement, STATUS,
    STATUS_TAGS,
    typeOptions
} from "../../utils/utils";
import DlSelectAdvanced from "../Shared/SelectAdvanced";
import courierActions from "../../actions/courierActions";
import DlTag from "../Shared/Tag";
import ApplicationsProgressIcons from "./ApplicationsProgressIcons";
import InputMask from "react-input-mask";
import DlModal from "../Shared/Modal";
import CourierAddSample from "../Samples/CourierAddSample";
import ConfirmModal from "../Shared/ConfirmModal";
import { get as _get } from "lodash";
import LabResultSample from "../Samples/LabResultSample";
import DlIcon from "../Shared/Icon";
import QRScannerModal from "../Shared/QRScannerModal";
import {QR_CODE_MARKING_LENGTH} from "../../utils/constants";

const samplingTypeToWords = {
    customer: "Клиент производит отбор и доставку проб в центр самостоятельно",
    courier: "Курьер производит отбор проб и доставку проб в центр",
    customer_samples: "Клиент производит отбор проб. Курьер доставляет пробы в центр"
};


const ApplicationDetailAdmin = () => {
    const { push, replace, query } = useRouter();
    const dispatch = useDispatch();
    const firstMain = useRef(null)

    // * STORE
    const { application, applicationSamples, sampleLoader, confirmLoader } = useSelector(state => state.application);
    const { couriersList } = useSelector(state => state.courier)

    // * STATE
    // client
    const [applicationResearchObject, setApplicationResearchObject] = useState("");
    const [applicationComplex, setApplicationComplex] = useState("");
    const [applicationMarkers, setApplicationMarkers] = useState([]);
    const [applicantFirstName, setApplicantFirstName] = useState("");
    const [applicantLastName, setApplicantLastName] = useState("");
    const [applicantMiddleName, setApplicantMiddleName] = useState("");
    const [applicantPhone, setApplicantPhone] = useState("");
    const [applicantEmail, setApplicantEmail] = useState("");
    const [applicationAddress, setApplicationAddress] = useState("");
    const [applicantTaxNumber, setApplicantTaxNumber] = useState("");
    const [applicantRegNumber, setApplicantRegNumber] = useState("");
    const [applicantCompanyName, setApplicantCompanyName] = useState("");
    const [applicantContract, setApplicantContract] = useState("");
    const [applicationPrice, setApplicationPrice] = useState(0);
    const [applicationPeriod, setApplicationPeriod] = useState(0);
    const [applicationPayment, setApplicationPayment] = useState(paymentType.card);
    const [applicationSampling, setApplicationSampling] = useState(samplingType.courier);

    // courier
    const [applicationROStandard, setApplicationROStandard] = useState("");
    const [applicationSamplesStandard, setApplicationSamplesStandard] = useState("");
    const [applicationIdentificationSigns, setApplicationIdentificationSigns] = useState("");
    const [applicationSamplesConditions, setApplicationSamplesConditions] = useState("");
    const [applicationSamplesInspectionResult, setApplicationSamplesInspectionResult] = useState("");
    const [applicationSamplesStorageConditions, setApplicationSamplesStorageConditions] = useState("");
    const [applicationCouriersComments, setApplicationCouriersComments] = useState("");
    const [applicationSampleResultSubmittedDate, setApplicationSampleResultSubmittedDate] = useState("");
    const [applicationSampleResultSubmittedTime, setApplicationSampleResultSubmittedTime] = useState("");

    // laboratory
    const [applicationAnalyzers, setApplicationAnalyzers] = useState("")
    const [applicationDrafter, setApplicationDrafter] = useState("")
    const [applicationLabManager, setApplicationLabManager] = useState("")
    const [isStatusChangedToAnalysis, setIsStatusChangedToAnalysis] = useState(false)

    // admin
    const [courierId, setCourierId] = useState(-1)
    const [courierOptions, setCourierOptions] = useState([])
    const [courierSelected, setCourierSelected] = useState(null)

    // utils
    const [isEditing, setIsEditing] = useState(false);
    const [sampleModalVisible, setSampleModalVisible] = useState(false)
    const [sampleState, setSampleState] = useState({})
    const [deleteModal, setDeleteModal] = useState(false)
    const [sampleDelete, setSampleDelete] = useState(null)
    const [resultModalVisible, setResultModalVisible] = useState(false)
    const [resultEdit, setResultEdit] = useState({})

    const [qrCodeScannerAcceptSampleVisible, setQrCodeScannerAcceptSampleVisible] = useState(false)
    const [qrCodeScannerCourierMarkingVisible, setQrCodeScannerCourierMarkingVisible] = useState(false)
    const [mainElWidth, setMainElWidth] = useState(900)
    const [sampleErrors, setSampleErrors] = useState({
        errors: {},
        isDirty: false
    })
    const [loadingId, setLoadingId] = useState(null)

    const [confirmCourierChangeModalVisible, setConfirmCourierChangeModalVisible] = useState(false)
    const [selectedCourierBuffer, setSelectedCourierBuffer] = useState(null)

    // * COMPUTED
    const applicationId = application && application.id;
    const SAMPLE_INITIAL_STATE = {
        application_id: applicationId,
        // marker_id: application.research_object && application.research_object.id,
        marker_id: 2, // ! todo: remove this
    }
    const tag = customizeStatusTag(STATUS_TAGS.find(t => t.status === (application && application.status)), 'admin')
    const applicationSamplesData = applicationSamples.map((s, i) => ({ ...s, index: i + 1 }))

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
    // * HOOKS
    const { marking, place, volume, sample_container } = sampleState
    useEffect(() => {
        if (sampleErrors.isDirty) validateSampleForm()
    }, [sampleErrors.isDirty, marking, place, volume, sample_container])

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
    }, [query.pid, courierId])

    useEffect(() => {
        if (applicationId) {
            const { profile } = application
            setApplicationResearchObject(application.research_object.title)
            setApplicationComplex(application.complex ? application.complex.title : "")
            setApplicationMarkers(application.markers.map((item, i) => {
                return { index: i + 1, id: item.id, indicator: item.title, standard: item.method_standard.title }
            }))
            setApplicantFirstName(profile.first_name)
            setApplicantLastName(profile.last_name)
            setApplicantMiddleName(profile.middle_name || "")
            setApplicantPhone(profile.phone)
            setApplicantEmail(profile.email)
            setApplicationAddress(application.address)
            setApplicantTaxNumber(profile.tax_number)
            setApplicantRegNumber(profile.reg_number)
            setApplicantCompanyName(profile.company_name)
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
                ? convertDate(application.sampling_report_submit_time, { format: 'dd LLL yyyy'})
                : "Утвердите акт отбора")
            setApplicationSampleResultSubmittedTime(application.sampling_report_submit_time
                ? convertDate(application.sampling_report_submit_time, { format: 'HH:mm' })
                : "Утвердите акт отбора")

            setApplicationAnalyzers(application.analyzers || "")
            setApplicationDrafter(application.drafter || "")
            setApplicationLabManager(application.lab_manager || "")

            setCourierId(application.courier ? application.courier.id : -1)
            setSampleState({
                ...sampleState,
                ...SAMPLE_INITIAL_STATE
            })
        }
    }, [application])

    useEffect(() => {
        dispatch(courierActions.getAllCouriers());
    }, [])

    useEffect(() => {
        if (couriersList) {
            if (courierId !== -1) {
                const courierToSet = couriersList.find(p => p.id === courierId)
                if (courierToSet) {
                    setCourierSelected({ value: courierToSet.id, label: courierToSet.first_name + " " + courierToSet.last_name })
                }
            }

            setCourierOptions(couriersList.map(c => {
                return { value: c.id, label: c.first_name + " " + c.last_name }
            }))
        }
    }, [couriersList, courierId])

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


    // * CONSTANTS
    // courier
    const INITIAL_STATE = {
        place: sampleState.place || "",
        marking: sampleState.marking || "",
        volume: sampleState.volume || "",
        preparation: sampleState.preparation || "",
        sample_container: sampleState.sample_container || "",
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
    const beforeSampleDelete = rowData => {
        setSampleDelete(rowData)
        setDeleteModal(true)
    }

    const handleSampleModalClose = () => {
        setSampleState(SAMPLE_INITIAL_STATE)
        setSampleModalVisible(false)
        setSampleErrors({ errors: {}, isDirty: false })
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

    const onDeleteSample = () => {
        if (!sampleDelete) return
        dispatch(applicationActions.deleteApplicationSample(sampleDelete, () => {
            setSampleDelete(null)
            setDeleteModal(false)
        }))
    }

    const handleQrScanCourierMarking = (QRdata) => {
        if (!(typeof(QRdata) === "string" && QRdata.length === QR_CODE_MARKING_LENGTH && /^\d+$/.test(QRdata))) {
            return DomNotification.error({ title: "Неверный формат QR-кода!", showClose: true, duration: 5000 });
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

        setQrCodeScannerCourierMarkingVisible(false)
        setSampleModalVisible(true)

        DomNotification.success({ title: "Маркировка успешно отсканирована", showClose: true, duration: 5000 });
    }

    // laboratory
    const samplesProtocolWithStatus = applicationSamples.map((sample, i) => {
        return {
            ...sample,
            index: i + 1,
            status: {
                time: sample.time,
                time_accepted: sample.time_accepted,
            }
        }
    })

    const onAcceptProtocolSample = sample => {
        if (!isStatusChangedToAnalysis) {
            setIsStatusChangedToAnalysis(true)
            const obj = {
                status: STATUS.analysis
            }
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
            dispatch(applicationActions.getApplicationSamples(applicationId))
            setLoadingId(null)
        }))
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
            laboratory_id: 0,
            application_id: applicationId,
            markings: [QRdata, ]
        }

        dispatch(applicationActions.acceptSampleLabByMarking(QRCodeScanObj, (data) => {
            let acceptedMarkingsStr = data.accepted.join(', ')
            let notAcceptedMarkingsStr = data.not_accepted.join(', ')
            DomNotification.info({ title: `Администратор может принять любую пробу.`, showClose: true, duration: 5000 });
            DomNotification.success({ title: `Принятые пробы:\n${acceptedMarkingsStr}\n\nНе принятые пробы:\n${notAcceptedMarkingsStr}`, showClose: true, duration: 5000 });
            dispatch(applicationActions.getApplicationSamples(applicationId))
        }))
    }

    const samplesResultsOptions = applicationSamples.map(sample => {
        return {
            ...sample,
            value: sample.id,
            label: `${sample.marking} (${sample.place})`,
        }
    })

    const resultsTableData = application && application.results && application.results.map((item, index) => {
        return {
            index: index + 1,
            ...item,
            marking: _get(item, "sample.marking", "—"),
            unit: _get(item, "marker.unit", "—"),
            norm_standard: item.marker,
            norm: getNormDisplayValue(_get(item, "marker.norm_from"), _get(item, "marker.norm_to")),
        }
    }) || []

    const beforeSampleResultsEdit = rowData => {
        setResultEdit(rowData)
        setResultModalVisible(true)
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

    // admin
    const attachCourier = (courierId) => {
        dispatch(applicationActions.attachCourier(applicationId, courierId, () => {
            DomNotification.success({ title: "Курьер успешно обновлён", showClose: true, duration: 5000 });
        }))

        DomNotification.success({ title: "Статус заявки успешно обновлён", showClose: true, duration: 5000 });
    }

    const cancelChangesClicked = () => {
        push("/")
        DomNotification.info({ title: "Успешная отмена редактирования", showClose: true, duration: 5000 });
    }

    const onSaveEditButtonClick = () => {
        setIsEditing(false);

        const obj = {
            first_name: applicantFirstName || null,
            last_name: applicantLastName || null,
            middle_name: applicantMiddleName || null,
            // phone: replaceMaskWithNumber(applicantPhone) || null,
            email: applicantEmail || null,
            address: applicationAddress || null,
            tax_number: applicantTaxNumber || null,
            reg_number: applicantRegNumber || null,
            company_name: applicantCompanyName || null,
            couriers_comment: applicationCouriersComments || null,
            samples_inspection_result: applicationSamplesInspectionResult || null,
            samples_storage_conditions: applicationSamplesStorageConditions || null,
            inspection_doc: null,
            sampling_result: null,
            identification_signs: applicationIdentificationSigns || null,
            analyzers: applicationAnalyzers || null,
            drafter: applicationDrafter || null,
            lab_manager: applicationLabManager || null,
        }
        dispatch(applicationActions.updateApplicationAdmin(obj, applicationId, () => {
            DomNotification.success({ title: "Заявка успешно обновлена", showClose: true, duration: 5000 });
        }));
    }
    const onCancelEditButtonClick = () => { setIsEditing(false); }
    const onCancelButtonClick = () => {
        const obj = { status: STATUS.canceled }
        dispatch(applicationActions.updateApplicationStatus(obj, applicationId, () => {
            DomNotification.success({ title: "Заявка успешно отменена", showClose: true, duration: 5000 });
        }));
    }
    const onRebornButtonClick = () => {
        const obj = { status: STATUS.accepted }
        dispatch(applicationActions.updateApplicationStatus(obj, applicationId, () => {
            DomNotification.success({ title: "Заявка успешно восстановлена", showClose: true, duration: 5000 });
        }));
    }
    const onDeleteButtonClick = () => {
        dispatch(applicationActions.deleteApplication(applicationId, () => {
            replace("/");
            DomNotification.success({ title: "Заявка успешно удалена", showClose: true, duration: 5000 });
        }));
    }

    const handleCourierSelect = (el) => {
        setConfirmCourierChangeModalVisible(false)
        if (el) {
            setCourierSelected(el)
            setCourierId(el.value)
            attachCourier(el.value)
        } else {
            setCourierSelected(null)
            attachCourier(-1)
        }
    }

    const initEditMode = () => {
        setIsEditing(true)
        scrollToElement(document.querySelector('body'))
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
                        <DlFormItem className={st.form_mt} label="Назначение курьера">
                            <DlSelectAdvanced
                                onSelect={el => {
                                    setSelectedCourierBuffer(el)
                                    setConfirmCourierChangeModalVisible(true)
                                }}
                                placeholder={"Выберите курьера из списка..."}
                                value={courierSelected}
                                options={courierOptions}
                                emptyMessage="Нет курьеров"
                                isClearable />
                        </DlFormItem>
                        <h1 className={st.title}>Заявка №{application.number}</h1>
                        {tag &&
                            <div className={st.status}>
                                <p className={st.statusLabel}>Статус заказа:</p>
                                <DlTag size="xs" type={tag.color} dark={tag.dark}>{tag.label}</DlTag>
                            </div>
                        }
                        <div className={st.progress_flow}>
                            <div className={st.progressIcons}>
                                <ApplicationsProgressIcons status={application.status} />
                            </div>
                        </div>
                        {application.profile.role === ROLE.company && <div>
                            <DlFormItem className={st.form_mt} label="ИНН">
                                <DlInput
                                    type={"tel"}
                                    disabled={!isEditing}
                                    value={applicantTaxNumber}
                                    placeholder="Введите ИНН..."
                                    onChange={ev => setApplicantTaxNumber(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} label="ОГРН">
                                <DlInput
                                    type={"tel"}
                                    disabled={!isEditing}
                                    placeholder="Введите ОГРН..."
                                    value={applicantRegNumber}
                                    onChange={ev => setApplicantRegNumber(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} label="Наименование юридического лица">
                                <DlInput
                                    disabled={!isEditing}
                                    placeholder='Введите наименование юридического лица...'
                                    value={applicantCompanyName}
                                    onChange={ev => setApplicantCompanyName(ev.target.value)}
                                />
                            </DlFormItem>
                        </div>}
                        <div className={st.application_details}>
                            {applicationResearchObject &&
                                <DlFormItem className={st.form_mt} label="Объект исследования">
                                    <DlInput
                                        disabled
                                        placeholder="Объект исследования не выбран"
                                        value={applicationResearchObject}
                                    />
                                </DlFormItem>
                            }
                            {applicationComplex &&
                                <DlFormItem className={st.form_mt} label="Комплекс">
                                    <DlInput
                                        disabled
                                        placeholder="Комплекс не выбран"
                                        value={applicationComplex}
                                    />
                                </DlFormItem>
                            }
                            {applicationMarkers.length > 0 &&
                                <div className={st.markers_container}>
                                    <p className={st.bigger_subtitle}>Перечень показателей</p>
                                    <DlTable
                                        tableData={applicationMarkers}
                                        headers={headersMarkers}
                                    />
                                </div>
                            }
                            <DlFormItem className={st.form_mt} innerClassName={st.formItem} multiple label="Полное наименование заявителя">
                                <div className={st.formInput}>
                                    <DlInput
                                        placeholder="Введите фамилию..."
                                        value={applicantLastName}
                                        disabled={!isEditing}
                                        onChange={ev => setApplicantLastName(ev.target.value)}
                                        wrapperClass={st.input}
                                    />
                                </div>
                                <div className={st.formInput}>
                                    <DlInput
                                        value={applicantFirstName}
                                        placeholder="Введите имя..."
                                        disabled={!isEditing}
                                        onChange={ev => setApplicantFirstName(ev.target.value)}
                                        wrapperClass={st.input}
                                    />
                                </div>
                                <div className={st.formInput}>
                                    <DlInput
                                        placeholder="Введите отчество..."
                                        value={applicantMiddleName}
                                        disabled={!isEditing}
                                        onChange={ev => setApplicantMiddleName(ev.target.value)}
                                        wrapperClass={st.input}
                                    />
                                </div>
                            </DlFormItem>
                            <div className={st.forms_inline}>
                                <DlFormItem className={st.forms_inline_item} label="Номер телефона">
                                    <InputMask
                                        mask="+7 (999) 999-99-99"
                                        maskPlaceholder="0"
                                        alwaysShowMask
                                        disabled
                                        value={applicantPhone}
                                    >
                                        {() => <DlInput disabled placeholder="+7 000 000-00-00" />}
                                    </InputMask>
                                </DlFormItem>
                                <DlFormItem className={st.forms_inline_item} label="Адрес электронной почты">
                                    <DlInput
                                        disabled={!isEditing}
                                        value={applicantEmail}
                                        placeholder="Введите адрес электронной почты..."
                                        onChange={ev => setApplicantEmail(ev.target.value)}
                                    />
                                </DlFormItem>
                            </div>
                            <DlFormItem className={st.form_mt} label="№ договора / № счета">
                                <DlInput
                                    disabled
                                    value={applicantContract}
                                    placeholder="№ договора / № счета"
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} label="Адрес отбора проб">
                                <DlInput
                                    disabled
                                    placeholder="Введите адрес отбора проб..."
                                    value={applicationAddress}
                                />
                            </DlFormItem>
                        </div>
                        <div className={st.act_of_samples}>
                            <p className={st.bigger_subtitle}>Акт отбора проб</p>
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
                            <DlFormItem className={st.form_mt} label="Идентификационные признаки (размер партии, дата изготовления)">
                                <DlInput
                                    placeholder="Введите идентификационные признаки (размер партии, дата изготовления)..."
                                    disabled={!isEditing}
                                    value={applicationIdentificationSigns}
                                    onChange={ev => setApplicationIdentificationSigns(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} label="Условия отбора">
                                <DlInput
                                    placeholder="Введите условия отбора..."
                                    disabled={!isEditing}
                                    value={applicationSamplesConditions}
                                    onChange={ev => setApplicationSamplesConditions(ev.target.value)}
                                />
                            </DlFormItem>
                        </div>
                    </div>
                    <div className={st.sidebar}>
                        <AlertCard type="info" className="dl">
                            <AlertCardSubtitle>Что забираем:</AlertCardSubtitle>
                            <AlertCardTitle>{applicationResearchObject}</AlertCardTitle>
                        </AlertCard>
                        <AlertCard type="warning" className="dl">
                            <AlertCardSubtitle>Тип оплаты:</AlertCardSubtitle>
                            <AlertCardTitle>{paymentTypeToWord[applicationPayment]}</AlertCardTitle>
                            <AlertCardSupertitle>{applicationPrice} ₽</AlertCardSupertitle>
                        </AlertCard>
                        <AlertCard type="warning" className="dl">
                            <AlertCardSubtitle>Отбор и доставка проб:</AlertCardSubtitle>
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
                        {applicationSamplesData.length > 0 &&
                            <div className={st.sampleTable}>
                                <DlTable
                                    tableData={applicationSamplesData}
                                    headers={sampleHeaders}
                                    rowClassName={(rowIndex, row) => {
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
                                    actions={({ rowData }) => (
                                        isEditing &&
                                        !application.is_sampling_report_submitted &&
                                        <TableActions
                                            onEdit={() => beforeSampleEdit(rowData)}
                                            onDelete={() => beforeSampleDelete(rowData)}
                                        />
                                    )}
                                />
                            </div>
                        }
                        <div className={st.sampleAddButton}>
                            {isEditing
                                && !application.is_sampling_report_submitted
                                && <DlButton type="primary" onClick={() => setSampleModalVisible(true)}>Добавить пробу</DlButton>
                            }
                        </div>
                    </div>
                </div>
                <div className={st.container}>
                    <div className={st.main} style={{ maxWidth: mainElWidth }}>
                        <div className={st.application_details}>
                            <DlFormItem label="Результат осмотра проб">
                                <DlInput
                                    placeholder="Введите результат осмотра проб..."
                                    disabled={!isEditing}
                                    value={applicationSamplesInspectionResult}
                                    onChange={ev => setApplicationSamplesInspectionResult(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} label="Условия и место хранения проб">
                                <DlInput
                                    placeholder="Введите условия и место хранения проб..."
                                    disabled={!isEditing}
                                    value={applicationSamplesStorageConditions}
                                    onChange={ev => setApplicationSamplesStorageConditions(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} label="Примечания">
                                <DlTextarea
                                    placeholder="Введите примечания..."
                                    disabled={!isEditing}
                                    value={applicationCouriersComments}
                                    onChange={ev => setApplicationCouriersComments(ev.target.value)}
                                />
                            </DlFormItem>
                        </div>
                    </div>
                </div>
                <div className={st.container}>
                    <div>
                        <div className={st.tableContainer}>
                            <div className={st.bigger_subtitle}>Акт передачи проб</div>
                            {samplesProtocolWithStatus.length > 0 &&
                                <div className={st.table}>
                                    <DlTable
                                        headers={sampleProtocolHeaders}
                                        tableData={samplesProtocolWithStatus}
                                        status={({ rowData }) => (
                                            <>
                                                {rowData.time_accepted ?
                                                    convertDate(rowData.time_accepted, { format: "dd.LL.yyyy в HH:mm" })
                                                    :
                                                    isEditing &&
                                                    <div>
                                                        <DlButton
                                                            type="primary"
                                                            size="sm"
                                                            loading={loadingId === rowData.id}
                                                            onClick={() => onAcceptProtocolSample(rowData)}
                                                        >
                                                            Принять
                                                        </DlButton>
                                                    </div>
                                                }
                                            </>
                                        )}
                                    />
                                </div>
                            }
                            { isEditing
                                && applicationSamples
                                && applicationSamples.length > 0
                                && !applicationSamples.every(s => !!s.time_accepted)
                                && <DlButton type="primary" onClick={() => setQrCodeScannerAcceptSampleVisible(true)}><DlIcon name={"qr-code"} />Сканировать QR-код</DlButton> }
                        </div>
                        <div className={st.tableContainer}>
                            <div className={st.bigger_subtitle}>Результаты</div>
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
                                        isEditing &&
                                        !application.is_results_submitted &&
                                        <TableActions
                                            onEdit={() => beforeSampleResultsEdit(rowData)}
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
                                    disabled={!isEditing}
                                    placeholder="Анализ проводил..."
                                    value={applicationAnalyzers}
                                    onChange={ev => setApplicationAnalyzers(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} multiple label="Протокол составил">
                                <DlInput
                                    disabled={!isEditing}
                                    placeholder="Протокол составил..."
                                    value={applicationDrafter}
                                    onChange={ev => setApplicationDrafter(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.form_mt} multiple label="Заведующий лабораторией">
                                <DlInput
                                    disabled={!isEditing}
                                    placeholder="Заведующий лабораторией..."
                                    value={applicationLabManager}
                                    onChange={ev => setApplicationLabManager(ev.target.value)}
                                />
                            </DlFormItem>
                        </div>
                    </div>
                </div>
                <div className={st.container}>
                    <div className={cx(st.main, st.mainFull, st.mainButtons)}>
                        <div className={st.actionButtons}>
                            {application.status === STATUS.canceled ?
                                <>
                                    <div className={st.actionButton}>
                                        <DlButton type="success" fullWidth onClick={onRebornButtonClick}>Восстановить заявку</DlButton>
                                    </div>
                                    <div className={st.actionButton}>
                                        <DlButton type="error" fullWidth onClick={onDeleteButtonClick}>Удалить заявку</DlButton>
                                    </div>
                                </>
                                :
                                <>
                                    {
                                        isEditing ?
                                            <>
                                                <div className={st.actionButton}>
                                                    <DlButton type="success" fullWidth onClick={onSaveEditButtonClick}>Сохранить изменения</DlButton>
                                                </div>
                                                <div className={st.actionButton}>
                                                    <DlButton type="primary" fullWidth onClick={onCancelEditButtonClick}>Отменить редактирование</DlButton>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className={st.actionButton}>
                                                    <DlButton type="info" fullWidth onClick={initEditMode}>Редактировать</DlButton>
                                                </div>
                                                <div className={st.actionButton}>
                                                    <DlButton type="primary" fullWidth outlined color="#969696" bgColor="transparent" onClick={onCancelButtonClick}>Отменить
                                                        заявку</DlButton>
                                                </div>
                                            </>
                                    }
                                </>
                            }
                            <div className={cx(st.actionButton, st.actionButtonLast)}>
                                <DlButton fullWidth type="primary" outlined color="#969696" bgColor="transparent" onClick={cancelChangesClicked}>Отмена</DlButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {sampleModalVisible &&
                <DlModal
                    title="Добавить пробу"
                    visible={sampleModalVisible}
                    onRequestClose={handleSampleModalClose}
                    onSave={handleSaveSample}
                    saving={sampleLoader}
                >
                    <CourierAddSample
                        value={sampleState}
                        onChange={val => setSampleState(val)}
                        errors={sampleErrors.errors}
                        typeOptions={typeOptions}
                        methodOptions={methodOptions}
                        onScanClicked={() => setQrCodeScannerCourierMarkingVisible(true)}
                    />
                </DlModal>
            }
            {resultModalVisible &&
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
                        samplesOptions={samplesResultsOptions}
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
                <p>Вы уверены что хотите удалить пробу?</p>
            </ConfirmModal>
            <QRScannerModal
                title="Сканировать QR-код"
                shouldCloseOnOverlayClick={false}
                visible={qrCodeScannerAcceptSampleVisible}
                onScan={(data) => handleQrScanAcceptSample(data)}
                onClose={() => setQrCodeScannerAcceptSampleVisible(false)}
                onRequestClose={() => setQrCodeScannerAcceptSampleVisible(false)}
            />
            <QRScannerModal
                title="Сканировать QR-код"
                shouldCloseOnOverlayClick={false}
                visible={qrCodeScannerCourierMarkingVisible}
                onScan={(data) => handleQrScanCourierMarking(data)}
                onClose={() => setQrCodeScannerCourierMarkingVisible(false)}
                onRequestClose={() => setQrCodeScannerCourierMarkingVisible(false)}
            />
            <ConfirmModal
                title={selectedCourierBuffer ? "Назначение курьера" : "Снятие курьера с назначение"}
                visible={confirmCourierChangeModalVisible}
                onClose={() => setConfirmCourierChangeModalVisible(false)}
                onPositive={() => handleCourierSelect(selectedCourierBuffer)}
                saving={confirmLoader}
                saveType="success"
                saveText={ selectedCourierBuffer ? "Да, назначить" : "Да, снять"}
            >
                <p>{selectedCourierBuffer ? `${selectedCourierBuffer.label} будет назначен курьером, всё верно?`: "Вы уверены, что хотите снять курьера с заявки?"}</p>
            </ConfirmModal>
        </>
    )
}


export default ApplicationDetailAdmin
