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
import DlBreadcrumb from "../Shared/Breadcrumb";

const AccountClient = () => {
    const { push } = useRouter();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const  currentUserId = currentUser && currentUser.user_id;


    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [passport, setPassport] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    useEffect(()  => {
        if (currentUserId) {
            setFirstName(currentUser.first_name)
            setSecondName(currentUser.second_name)
            setMiddleName(currentUser.middle_name || "")
            setPassport(currentUser.passport)
            setLogin(currentUser.login_)
            setPassword(currentUser.password_)
        }
    }, [currentUserId])


    const onEditButtonClick = () => {
        setIsEditing(true);
    }

    const onSaveEditButtonClick = () => {
        setIsEditing(false);

        const obj = {
            first_name: firstName || null,
            second_name: secondName || null,
            middle_name: middleName || null,
            login_: login || null,
            password_: password || null
        }

        dispatch(userActions.updateUser(obj, currentUser.user_id, () => {
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

    return (
        currentUserId &&
            <div className={st.container}>
                <div className={st.main}>
                    <DlBreadcrumb
                        currentIndex={2}
                        items={[
                            { index: 1, title: "Билеты", path: '/' },
                            { index: 2, title: "Личный кабинет" }
                        ]}
                    />
                    <h1 className={st.title}>Личный кабинет</h1>
                    <div>
                        <DlFormItem className={st.formItem} innerClassName={st.formItemInner} multiple label="Полное наименование">
                            <div className={st.formInput}>
                                <DlInput
                                    value={secondName}
                                    disabled={!isEditing}
                                    placeholder="Фамилия"
                                    onChange={ev => setSecondName(ev.target.value)}
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
                        <DlFormItem className={st.formItem} innerClassName={st.formItemInner} multiple label="Пасспорт">
                            <div className={st.formInput}>
                                <DlInput
                                    value={passport}
                                    disabled
                                    placeholder="Пасспорт"
                                    onChange={ev => setPassport(ev.target.value)}
                                    wrapperClass={st.input}
                                />
                            </div>
                        </DlFormItem>
                        <DlFormItem className={st.formItem} innerClassName={st.formItemInner} multiple label="Логин и пароль">
                            <div className={st.formInput}>
                                <DlInput
                                    value={login}
                                    disabled={!isEditing}
                                    placeholder="Логин"
                                    onChange={ev => setLogin(ev.target.value)}
                                    wrapperClass={st.input}
                                />
                            </div>
                            <div className={st.formInput}>
                                <DlInput
                                    placeholder="Пароль"
                                    disabled={!isEditing}
                                    value={password}
                                    onChange={ev => setPassword(ev.target.value)}
                                    wrapperClass={st.input}
                                />
                            </div>
                        </DlFormItem>
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