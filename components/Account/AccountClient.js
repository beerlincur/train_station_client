import st from "./Account.module.css";
import DlFormItem from "../Shared/FormItem/FormItem";
import DlInput from "../Shared/Input";
import DlButton from "../Shared/Button";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import jsCookie from "js-cookie";
import {TOKEN_NAME} from "../../utils/constants";
import userActions from "../../actions/user";
import DomNotification from "../Shared/DomNotification";
import InputMask from "react-input-mask"
import {ROLE} from '../../utils/utils'
import DlCheckbox from "../Shared/Checkbox";
import DlBreadcrumb from "../Shared/Breadcrumb";

const AccountClient = () => {
    const { push } = useRouter();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const  currentUserId = currentUser && currentUser.id;

    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [taxNumber, setTaxNumber] = useState("");
    const [regNumber, setRegNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isPromoted, setIsPromoted] = useState(false);
    const [isNotified, setIsNotified] = useState(false);

    useEffect(()  => {
        if (currentUserId) {
            setAddress(currentUser.address || "")
            setEmail(currentUser.email || "")
            setTaxNumber(currentUser.tax_number || "")
            setRegNumber(currentUser.reg_number || "")
            setCompanyName(currentUser.company_name || "")
            setFirstName(currentUser.first_name)
            setLastName(currentUser.last_name)
            setMiddleName(currentUser.middle_name || "")
            setPhoneNumber(currentUser.phone)
            setIsPromoted(currentUser.is_promoted)
            setIsNotified(currentUser.is_notified)
        }
    }, [currentUserId])


    const onEditButtonClick = () => {
        setIsEditing(true);
    }

    const onSaveEditButtonClick = () => {
        setIsEditing(false);

        const obj = {
            first_name: firstName || null,
            last_name: lastName || null,
            middle_name: middleName || null,
            // phone: replaceMaskWithNumber(phoneNumber) || null,
            email: email || null,
            address: address || null,
            tax_number: taxNumber || null,
            reg_number: regNumber || null,
            company_name: companyName || null
        }

        dispatch(userActions.updateUser(obj, currentUser.id, () => {
            dispatch(userActions.getCurrentUser())
            DomNotification.success({title: "Профиль успешно обновлён", showClose: true, duration: 5000});
        }));
    }

    const onCancelEditButtonClick = () => {
        setIsEditing(false);
    }

    const onLogoutClicked = () => {
        // * RESET STORE
        dispatch(userActions.logout(() => {
            jsCookie.remove(TOKEN_NAME);
            push("/passport/login")
        }))
    }

    const updateIsPromoted = (val) => {
        setIsPromoted(val)
        const obj = {
            is_promoted: val,
        }
        dispatch(userActions.updateUser(obj, currentUser.id, () => {
            DomNotification.success({title: "Профиль успешно обновлён", showClose: true, duration: 5000});
        }));
    }

    const updateIsNotified = (val) => {
        setIsNotified(val)
        const obj = {
            is_notified: val,
        }
        dispatch(userActions.updateUser(obj, currentUser.id, () => {
            DomNotification.success({title: "Профиль успешно обновлён", showClose: true, duration: 5000});
        }));
    }

    return (
        currentUserId &&
            <div className={st.container}>
                <div className={st.main}>
                    <DlBreadcrumb
                        currentIndex={2}
                        items={[
                            { index: 1, title: "Заявки", path: '/' },
                            { index: 2, title: "Личный кабинет" }
                        ]}
                    />
                    <h1 className={st.title}>Личный кабинет</h1>
                    {currentUser.role === ROLE.company &&
                        <div>
                            <DlFormItem className={st.formItem} label="ИНН">
                                <DlInput
                                    disabled={!isEditing}
                                    value={taxNumber}
                                    placeholder="3664069397"
                                    onChange={ev => setTaxNumber(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.formItem} label="ОГРН">
                                <DlInput
                                    disabled={!isEditing}
                                    placeholder="1053600591197"
                                    value={regNumber}
                                    onChange={ev => setRegNumber(ev.target.value)}
                                />
                            </DlFormItem>
                            <DlFormItem className={st.formItem} label="Наименование юридического лица">
                                <DlInput
                                    disabled={!isEditing}
                                    placeholder='ООО "Пример"'
                                    value={companyName}
                                    onChange={ev => setCompanyName(ev.target.value)}
                                />
                            </DlFormItem>
                        </div>
                    }
                    <div>
                        <DlFormItem className={st.formItem} innerClassName={st.formItemInner} multiple label="Полное наименование заявителя">
                            <div className={st.formInput}>
                                <DlInput
                                    value={lastName}
                                    disabled={!isEditing}
                                    placeholder="Фамилия"
                                    onChange={ev => setLastName(ev.target.value)}
                                    wrapperClass={st.input}
                                />
                            </div>
                            <div className={st.formInput}>
                                <DlInput
                                    placeholder="Имя"
                                    disabled={!isEditing}
                                    value={firstName}
                                    onChange={ev => setFirstName(ev.target.value)}
                                    wrapperClass={st.input}
                                />
                            </div>
                            <div className={st.formInput}>
                                <DlInput
                                    placeholder="Отчество"
                                    onChange={ev => setMiddleName(ev.target.value)}
                                    wrapperClass={st.input}
                                    value={middleName}
                                    disabled={!isEditing}
                                />
                            </div>
                        </DlFormItem>
                        <div className={st.forms_inline}>
                            <DlFormItem className={st.forms_inline_item} label="Номер телефона">
                                <InputMask
                                    mask="+7 (999) 999-99-99"
                                    maskPlaceholder="0"
                                    alwaysShowMask
                                    value={phoneNumber}
                                    disabled
                                >
                                    {(inputProps) => <DlInput placeholder="+7 (000) 000-00-00" disabled />}
                                </InputMask>
                            </DlFormItem>
                            <DlFormItem className={st.forms_inline_item} label="Адрес почты">
                                <DlInput
                                    placeholder="example@example.com"
                                    disabled={!isEditing}
                                    value={email}
                                    onChange={ev => setEmail(ev.target.value)}
                                />
                            </DlFormItem>
                        </div>
                        <div className={st.notifications}>
                            <p className={st.bigger_subtitle}>Уведомления</p>
                            <div className={st.checkbox_div}>
                                <DlCheckbox value={isPromoted} onChange={val => updateIsPromoted(val)} label="Акции и предложения" />
                            </div>
                            <div className={st.checkbox_div}>
                                <DlCheckbox value={isNotified} onChange={val => updateIsNotified(val)} label="Информация о заявках и обновлении статусов" />
                            </div>
                        </div>
                    </div>

                    <div className={st.footer_buttons}>
                        <>
                            {
                                isEditing ?
                                    <>
                                        <div className={st.footer_button}>
                                            <DlButton type="success" fullWidth onClick={onSaveEditButtonClick}>Сохранить изменения</DlButton>
                                        </div>
                                        <div className={st.footer_button}>
                                            <DlButton type="primary" fullWidth onClick={onCancelEditButtonClick}>Отменить редактирование</DlButton>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={st.footer_button}>
                                            <DlButton type="info" fullWidth onClick={onEditButtonClick}>Редактировать</DlButton>
                                        </div>
                                    </>
                            }
                        </>
                        <div className={st.footer_button}>
                            <DlButton type="error" fullWidth onClick={onLogoutClicked}>Выйти из аккаунта</DlButton>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AccountClient