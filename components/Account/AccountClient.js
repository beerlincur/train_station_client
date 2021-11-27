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
import orderActions from "../../actions/order";
import RaceItemClient from "../Ticket/RaceItemClient";
import OrderItemClient from "../Order/OrderItemClient";
import cx from "classnames";
import {convertDate} from "../../utils/utils";

const AccountClient = () => {
    const { push } = useRouter();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const  currentUserId = currentUser && currentUser.user_id;

    const { ordersList, loader } = useSelector(state => state.order)

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

    useEffect(() => {
        if (currentUserId) {
            dispatch(orderActions.getUserOrders())
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
                            { index: 1, title: "Все рейсы", path: '/' },
                            { index: 2, title: "Личный кабинет" }
                        ]}
                    />
                    <h1 className={st.title}>Личный кабинет</h1>
                    <div className={cx(st.item, st.flex)}>
                        <div>
                            <DlFormItem className={st.formItem} label="Фамилия">
                                <DlInput value={secondName}
                                         disabled
                                         wrapperClass={st.input}
                                />
                            </DlFormItem>
                        </div>

                        <div>
                            <DlFormItem className={st.formItem} label="Имя">
                                <DlInput value={firstName}
                                         disabled
                                         wrapperClass={st.input}
                                />
                            </DlFormItem>
                        </div>
                    </div>

                    <div className={cx(st.item, st.flex)}>
                        <div>
                            <DlFormItem className={st.formItem} label="Логин">
                                <DlInput value={login}
                                         disabled
                                         wrapperClass={st.input}
                                />
                            </DlFormItem>
                        </div>

                        <div>
                            <DlFormItem className={st.formItem} label="Пасспорт">
                                <DlInput value={passport}
                                         disabled
                                         wrapperClass={st.input}
                                />
                            </DlFormItem>
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
                <h1 className={st.title}>Мои заказы</h1>
                <div className={st.applicationsList}>
                    {loader ?
                        <div className={st.no_applications_label}>Загрузка...</div>
                        :
                        (ordersList.length === 0 ?
                                <div className={st.no_applications_label}>Заказов пока нет</div>
                                :
                                ordersList.map((item, i) => {
                                    return (
                                        <div key={i} className={st.applicationsItem}>
                                            <OrderItemClient {...item}/>
                                        </div>
                                    )
                                })
                        )
                    }
                </div>
            </div>
    )
}

export default AccountClient