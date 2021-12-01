import st from "./UserItem.module.css"
import React from "react";
import cx from "classnames";
import TicketInfo from "../Ticket/TicketInfo";
import ApplicationsDocument from "../Shared/Document/Document";
import {ROLE, ROLE_RUSSIAN} from "../../utils/utils";
import DlButton from "../Shared/Button";
import userActions from "../../actions/user";
import {useDispatch} from "react-redux";
import DomNotification from "../Shared/DomNotification";


const UserItem = props => {
    const dispatch = useDispatch()

    const tag = {
        color: 'success',
        label: "Активен",
        dark: false,
    }

    const onMakeConductorClicked = () => {
        const obj = {
            role_id: ROLE.conductor
        }
        dispatch(userActions.updateUser(obj, props.user_id, () => {
            dispatch(userActions.getAllUsers())
            DomNotification.success({title: "Пользователь успешно обновлён", showClose: true, duration: 5000});
        }));
    }

    const onMakeClientClicked = () => {
        const obj = {
            role_id: ROLE.client
        }
        dispatch(userActions.updateUser(obj, props.user_id, () => {
            dispatch(userActions.getAllUsers())
            DomNotification.success({title: "Пользователь успешно обновлён", showClose: true, duration: 5000});
        }));
    }

    return (
        <div
            className={cx(st.application, st.isDone)}
        >
            <div className={cx(st.content, st.isDone)}>
                <div className={st.info}>
                    <TicketInfo
                        tag={tag}
                        dateTitle={`Пасспорт ${props.passport}`}
                        numberTitle={props.second_name + ' ' + props.first_name + (props.middle_name ? ' ' + props.middle_name : '')}
                    />
                </div>
                <div className={cx(st.status, st.statusDone)}>
                    <div className={st.document}>
                        <ApplicationsDocument title={`Кол-во поездок`} timeText={props.amount_of_orders} />
                    </div>
                    <div className={st.document}>
                        <ApplicationsDocument title={`Роль`} timeText={ROLE_RUSSIAN[props.role_id]}/>
                    </div>
                    {props.role_id === ROLE.client &&
                    <div className={st.buy_button}>
                        <DlButton size="sm" type="success" onClick={onMakeConductorClicked}>Сделать проводником</DlButton>
                    </div>
                    }
                    {props.role_id === ROLE.conductor &&
                    <div className={st.buy_button}>
                        <DlButton size="sm" type="primary" onClick={onMakeClientClicked}>Сделать клиентом</DlButton>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default UserItem