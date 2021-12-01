import st from "./index.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DlHeadTitle from "../../components/Shared/HeadTitle";
import DefaultLayout from "../../layouts/DefaultLayout";
import userActions from "../../actions/user";
import UserItem from "../../components/User/UserItem";


const UsersAdminPage = () => {
    const dispatch = useDispatch();

    const { usersList, usersListLoader } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(userActions.getAllUsers());
    }, [])

    return (
        <>
            <DlHeadTitle title={`Пользователи`} />
            <div className={st.title_container}>
                <div className={st.main}>
                    <h1 className={st.title}>Пользователи</h1>
                </div>
            </div>
            <div className={st.applicationsList}>
                {usersListLoader ?
                    <div className={st.no_applications_label}>Загрузка...</div>
                    :
                    (usersList.length === 0 ?
                            <div className={st.no_applications_label}>Пользователей пока нет</div>
                            :
                            usersList.map((item, i) => {
                                return (
                                    <div key={i} className={st.applicationsItem}>
                                        <UserItem {...item}/>
                                    </div>
                                )
                            })
                    )
                }
            </div>
        </>
    )
}

UsersAdminPage.getLayout = page => <DefaultLayout>{page}</DefaultLayout>

export default UsersAdminPage;