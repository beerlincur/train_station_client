import { useEffect, useState } from "react"
import DlFormItem from "../../../components/Shared/FormItem/FormItem"
import DlInput from "../../../components/Shared/Input"
import DlButton from "../../../components/Shared/Button"
import PassportLayout from "../../../layouts/PassportLayout"
import st from './login.module.css'
import DlHeadTitle from "../../../components/Shared/HeadTitle"
import LoginInnerLayout from "../../../components/Login/LoginInnerLayout"
import { formatCodeTime, isValidNumber, replaceMaskWithNumber } from '../../../utils/utils'
import InputMask from "react-input-mask"
import { useRouter } from "next/router"
import { useDispatch, useSelector } from "react-redux"
import userActions from "../../../actions/user"
import CodeInput from "../../../components/Shared/CodeInput"


const Login = () => {
    const { push, query } = useRouter();

    const dispatch = useDispatch()
    // * REDUX STATE
    const { loader } = useSelector(state => state.user)

    // * STATE
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("")
    const [step, setStep] = useState(1)
    const [errors, setErrors] = useState({})
    const [lastLoadedTime, setLastLoadedTime] = useState(0)
    const [getCounts, setGetCounts] = useState(0)


    // * METHODS
    const handleKeyPress = ev => {
        if (ev.key === "Enter") {
            onGetCode()
        }
    }


    const onGetCode = () => {
        if (lastLoadedTime > 0) return;
        const realPhone = replaceMaskWithNumber(phoneNumber)
        if (!isValidNumber(realPhone)) {
            return setErrors({ ...errors, phoneNumber: "Телефон не валидный!" })
        }
        setErrors({})
        dispatch(userActions.getAuthCode(realPhone, () => {
            setStep(2)
            setLastLoadedTime((getCounts) * 20)
            setGetCounts(getCounts + 1);
        }))
    }
    useEffect(() => {
        if (!lastLoadedTime) return
        const intervalId = setInterval(() => {
            setLastLoadedTime(lastLoadedTime - 1)
        }, 1000);
        if (lastLoadedTime <= 0) {
            clearInterval(intervalId)
            setLastLoadedTime(null)
        }
        return () => clearInterval(intervalId)
    }, [lastLoadedTime])

    const onVerifyCode = () => {
        const phone = replaceMaskWithNumber(phoneNumber)
        dispatch(userActions.verifyAuthCode({ phone: phone, code: verificationCode }, () => {
            const toPath = (query && query.from) || "/"
            push(toPath)
        }))
    }

    if (step === 2) {
        return (
            <LoginInnerLayout
                title="Код подтверждения"
                defaultBtn={
                    <div className={st.action}>
                        <DlButton fullWidth outlined onClick={onGetCode}>
                            {!!lastLoadedTime ?
                                <>
                                    <span>Код не пришел &nbsp;</span>
                                    <span>({formatCodeTime(lastLoadedTime)})</span>
                                </>
                                :
                                <span>Получить код</span>
                            }
                        </DlButton>
                    </div>
                }
            >
                <DlHeadTitle title="Код подтверждения" />
                <div className={st.item}>
                    <DlFormItem dark label={`Отправили на ${phoneNumber}`}>
                        <div className={st.itemCode}>
                            <CodeInput
                                value={verificationCode}
                                onChange={setVerificationCode}
                                onSubmit={onVerifyCode}
                            />
                        </div>
                    </DlFormItem>
                </div>
            </LoginInnerLayout>
        )
    }

    return (
        <LoginInnerLayout
            title="Вход в личный кабинет"
            successBtn={
                <div className={st.action}>
                    <DlButton type="success" fullWidth onClick={onGetCode} loading={loader}>
                        <span>Получить код</span>
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
                <DlFormItem dark label="Номер телефона">
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        maskPlaceholder="0"
                        alwaysShowMask
                        value={phoneNumber}
                        onChange={ev => setPhoneNumber(ev.target.value)}
                    >
                        {() => <DlInput type={"tel"} autoFocus placeholder="+7 (000) 000-00-00" error={errors.phoneNumber} onKeyPress={handleKeyPress} />}
                    </InputMask>
                </DlFormItem>
            </div>
        </LoginInnerLayout>
    )
}

Login.getLayout = page => <PassportLayout>{page}</PassportLayout>

export default Login
