import { useEffect, useState } from "react"
import DlInput from "../../../components/Shared/Input"
import DlButton from "../../../components/Shared/Button"
import st from './login.module.css'
import DlHeadTitle from "../../../components/Shared/HeadTitle"
import LoginInnerLayout from "../../../components/Login/LoginInnerLayout"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import PassportLayout from "../../../layouts/PassportLayout";
import userActions from "../../../actions/user";


const Login = () => {
    const { push, query } = useRouter();

    const dispatch = useDispatch()
    // * REDUX STATE
    const { loader } = useSelector(state => state.user)

    // * STATE
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")


    // * METHODS
    const handleKeyPress = ev => {
        if (ev.key === "Enter") {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        const obj = {
            login: login,
            password: password
        }
        dispatch(userActions.loginUser(obj, () => {
            push('/')
        }))
    }

    return (
        <LoginInnerLayout
            title="Вход в личный кабинет"
            successBtn={
                <div className={st.action}>
                    <DlButton type="success" fullWidth onClick={handleSubmit} loading={loader}>
                        <span>Войти</span>
                    </DlButton>
                </div>
            }
            defaultBtn={
                <div className={st.action}>
                    <DlButton fullWidth outlined onClick={() => push("/passport/register")}>Зарегистрироваться</DlButton>
                </div>
            }
        >
            <DlHeadTitle title="Вход" />
            <div className={st.item}>
                <DlInput
                    placeholder="Введите логин..."
                    value={login}
                    onChange={ev => setLogin(ev.target.value)}
                />
            </div>
            <div className={st.item}>
                <DlInput
                    placeholder="Введите пароль..."
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    onKeyPress={handleKeyPress}
                />
            </div>
        </LoginInnerLayout>
    )
}

Login.getLayout = page => <PassportLayout>{page}</PassportLayout>

export default Login
