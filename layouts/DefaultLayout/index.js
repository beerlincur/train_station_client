import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userActions from "../../actions/user";
import jsCookie from "js-cookie"
import DlIcon from "../../components/Shared/Icon";
import DefaultLayoutHeader from "./DefaultLayoutHeader";
import st from './index.module.css'
import { useRouter } from "next/router";
import { TOKEN_NAME } from "../../utils/constants";
import { isValidToken } from "../../utils/auth";

const DefaultLayout = (props) => {
    const dispatch = useDispatch()
    const { asPath, isReady, push } = useRouter();

    const { currentUser, loader } = useSelector(state => state.user)

    useEffect(() => {
        if (!process.browser || !isReady) return
        const token = jsCookie.get(TOKEN_NAME)
        if (!token || !isValidToken(token)) {
            let redirectPath = "/passport/login"
            if (isReady) {
                redirectPath += `?from=${asPath}`
            }
            return push(redirectPath)
        }
        if (!currentUser) {
            if (token) {
                dispatch(userActions.getCurrentUser(token))
            } else {
                let redirectPath = "/passport/login"
                if (isReady) {
                    redirectPath += `?from=${asPath}`
                }
                return push(redirectPath)
            }
        }
    }, [isReady])

    if (!currentUser || loader) {
        return (
            <div className={st.loaderWrapper}>
                <div className={st.loader}>
                    <DlIcon className={st.spinner} name="spinner" />
                    <span>Загрузка...</span>
                </div>
            </div>
        )
    }
    return (
        <div className={st.main}>
            <div className={st.header}>
                <DefaultLayoutHeader />
            </div>

            <main className={st.content}>
                <div className="container">
                    {props.children}
                </div>
            </main>

        </div>
    )
}

export default DefaultLayout
