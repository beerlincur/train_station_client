import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
    getNormDisplayValue,
    getResultClassName,
    headersResults,
    reportTypes, ROLE, samplingType, STATUS,
    STATUS_TAGS
} from "../../utils/utils";
import applicationActions from "../../actions/application";
import st from "./ApplicationDetail.module.css";
import DlTag from "../Shared/Tag";
import ApplicationsProgressIcons from "./ApplicationsProgressIcons";
import DlFormItem from "../Shared/FormItem/FormItem";
import DlInput from "../Shared/Input";
import DlButton from "../Shared/Button";
import ApplicationsDocument from "./ApplicationsDocument";
import AlertCardSubtitle from "../Shared/AlertCardSubtitle";
import AlertCard from "../Shared/AlertCard";
import DomNotification from "../Shared/DomNotification";
import InputMask from "react-input-mask"
import { replaceMaskWithNumber } from '../../utils/utils'
import DlBreadcrumb from "../Shared/Breadcrumb";
import DlTable from "../Shared/Table";
import {get as _get} from "lodash";
import cx from "classnames"


const headers = [
    { name: "index", label: "№", width: "30px" },
    { name: "indicator", label: "Показатель", minWidth: 250 },
    { name: "standard", label: "Стандарт", minWidth: 200 },
    { name: "actions", label: "", width: "100px" }
];

const ApplicationDetailClient = () => {
    const { push, replace, query } = useRouter();
    const dispatch = useDispatch();
    const firstMain = useRef(null)

    // * STORE
    const { application, applicationSamples, sampleLoader, loader } = useSelector(state => state.application);
    const { currentUser } = useSelector(state => state.user)
    
    // states for editing
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
    
    const [isApplicationResultsSubmitted, setIsApplicationResultsSubmitted] = useState(false);
    const [mainElWidth, setMainElWidth] = useState(900)
    
    // * COMPUTED PROPS
    const applicationId = application && application.id;
    const applicationProfileId = application && application.profile && application.profile.id;
    const currentUserId = currentUser && currentUser.id;
    const tag = STATUS_TAGS.find(t => t.status === (application && application.status))

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

    // * HOOKS
    // set container main width
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
        if ((applicationProfileId && currentUserId) && (applicationProfileId !== currentUserId)) {
            return push("/")
        }
    }, [applicationProfileId, currentUserId])


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
            setIsApplicationResultsSubmitted(application.is_results_submitted)
            setApplicationPrice(application.price)
            setApplicationPeriod(application.period)
        }
    }, [applicationId])


    const [isEditing, setIsEditing] = useState(false);

    const onEditButtonClick = () => { setIsEditing(true); }

    // const tableSampleResults = applicationSamples.map((sample, i) => {
    //     return {
    //         ...sample,
    //         index: i + 1,
    //         norm_standard: _get(sample, "marker.norm_standard.title", ""),
    //     }
    // })

    const onSaveEditButtonClick = () => {
        setIsEditing(false);

        const obj = {
            first_name: applicantFirstName || null,
            last_name: applicantLastName || null,
            middle_name: applicantMiddleName || null,
            phone: replaceMaskWithNumber(applicantPhone) || null,
            email: applicantEmail || null,
            address: applicationAddress || null,
            tax_number: applicantTaxNumber || null,
            reg_number: applicantRegNumber || null,
            company_name: applicantCompanyName || null
        }
        dispatch(applicationActions.updateApplicationClient(obj, application.id, () => {
            DomNotification.success({ title: "Заявка успешно обновлена", showClose: true, duration: 5000 });
        }));
    }

    const onCancelEditButtonClick = () => { setIsEditing(false); }

    const onCancelButtonClick = () => {
        const obj = { status: STATUS.canceled }
        dispatch(applicationActions.updateApplicationStatus(obj, application.id, () => {
            DomNotification.success({ title: "Заявка успешно отменена", showClose: true, duration: 5000 });
        }));
    }

    const onRebornButtonClick = () => {
        const rebornStatus = application.sampling === samplingType.customer ? STATUS.from_client : STATUS.courier_selection
        const obj = { status: rebornStatus }
        dispatch(applicationActions.updateApplicationStatus(obj, application.id, () => {
            DomNotification.success({ title: "Заявка успешно восстановлена", showClose: true, duration: 5000 });
        }));
    }

    const onDeleteButtonClick = () => {
        dispatch(applicationActions.deleteApplication(application.id, () => {
            replace("/");
            DomNotification.success({ title: "Заявка успешно удалена", showClose: true, duration: 5000 });
        }));
    }

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

    if ((applicationProfileId && currentUserId) && (applicationProfileId !== currentUserId)) {
        return <div />
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
                                    { index: 2, title: `Заявка №${application.number}`}
                                ]}
                            />
                            <h1 className={st.title}>Заявка №{application.number}</h1>
                            <h2 className={st.subtitle}>Принята {application.created_at.substring(0, 10)}</h2>
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
                    <div className={cx(st.container)}>
                        <div className={st.main}>
                            {applicationMarkers.length > 0 &&
                                <div className={st.markers_container}>
                                    <p className={st.bigger_subtitle}>Перечень показателей</p>
                                    <DlTable
                                        tableData={applicationMarkers}
                                        headers={headers}
                                    />
                                </div>
                            }
                        {isApplicationResultsSubmitted &&
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
                                    />
                                </div>
                                }
                            </div>
                        }
                        </div>
                    </div>
                    <div className={cx(st.container)}>
                        <div className={st.main} style={{ maxWidth: mainElWidth }}>
                            <div>
                                <DlFormItem className={st.form_mt} innerClassName={st.formItem} multiple label="Полное наименование заявителя">
                                    <div className={st.formInput}>
                                        <DlInput
                                            placeholder="Введите фамилию..."
                                            value={applicantLastName}
                                            disabled={!isEditing}
                                            onChange={ev => setApplicantLastName(ev.target.value)}
                                        />
                                    </div>
                                    <div className={st.formInput}>
                                        <DlInput
                                            value={applicantFirstName}
                                            placeholder="Введите имя..."
                                            disabled={!isEditing}
                                            onChange={ev => setApplicantFirstName(ev.target.value)}
                                        />
                                    </div>
                                    <div className={st.formInput}>
                                        <DlInput
                                            placeholder="Введите отчество..."
                                            value={applicantMiddleName}
                                            disabled={!isEditing}
                                            onChange={ev => setApplicantMiddleName(ev.target.value)}
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
                                            onChange={ev => setApplicantPhone(ev.target.value)}
                                        >
                                            {() => <DlInput type={"tel"} disabled placeholder="+7 000 000-00-00" />}
                                        </InputMask>
                                    </DlFormItem>
                                    <DlFormItem label="Адрес электронной почты">
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
                                        type={"tel"}
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
                    
                            <div className={st.amount}>
                                <div className={st.amountText}>Итого к оплате:</div>
                                <div className={st.amountNumber}>
                                    <span>{applicationPrice} </span>
                                    {/*<span className={st.amountCents}>41</span>*/}
                                    <span>₽</span>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    {!application.courier || application.status === STATUS.canceled ?
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
                                                            {!application.courier &&
                                                                <>
                                                                    <div className={st.actionButton}>
                                                                        <DlButton type="info" fullWidth onClick={onEditButtonClick}>Редактировать</DlButton>
                                                                    </div>
                                                                    <div className={st.actionButton}>
                                                                        <DlButton type="primary" fullWidth outlined color="#969696" bgColor="transparent" onClick={onCancelButtonClick}>Отменить
                                                                            заявку</DlButton>
                                                                    </div>
                                                                </>
                                                            }
                                                        </>
                                                }
                                            </>
                                        }
                                    </div>

                            </div>
                        </div>
                        :
                        <></>
                    }
                </div>
            }
        </>
    )
}

export default ApplicationDetailClient