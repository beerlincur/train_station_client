import DlFormItem from "../../../components/Shared/FormItem/FormItem"
import DlInput from "../../../components/Shared/Input"
import DlButton from "../../../components/Shared/Button"
import PassportLayout from "../../../layouts/PassportLayout"
import st from './register.module.css'
import cx from 'classnames'
import DlHeadTitle from "../../../components/Shared/HeadTitle"
import { Formik, Form, Field } from 'formik';
import { useDispatch } from "react-redux"
import userActions from "../../../actions/user"
import InputMask from "react-input-mask"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {ROLE} from "../../../utils/utils";


const Register = () => {
    
    const dispatch = useDispatch();
    const { push, query } = useRouter();

    const [formData, setFormData] = useState()


    const handleSubmit = (values) => {
        dispatch(userActions.registerUser({...values, role_id: ROLE.client}))
    }

    return (
        <div className={st.login}>
            <DlHeadTitle title="Регистрация" />
            <h1 className={st.title}>Регистрация</h1>
            <Formik
                initialValues={{ second_name: "", first_name: "", middle_name: "", passport: "" }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className={cx(st.item, st.flex)}>
                            <DlFormItem dark className={st.formItem} label="Фамилия" required>
                                <Field name="second_name">
                                    {data => <DlInput dark {...data} autoFocus placeholder="Иванов..." />}
                                </Field>
                            </DlFormItem>
                            <DlFormItem dark className={st.formItem} label="Имя" required>
                                <Field name="first_name">
                                    {data => <DlInput dark placeholder="Андрей..." {...data} />}
                                </Field>
                            </DlFormItem>
                            <DlFormItem dark className={st.formItem} label="Отчество">
                                <Field name="middle_name">
                                    {data =>  <DlInput dark placeholder="Андреевич..."  {...data} />}
                                </Field>
                            </DlFormItem>
                        </div>
                        <div className={st.item}>
                            <DlFormItem dark label="Паспорт" required>
                                <Field name="passport">
                                    {data => <DlInput dark {...data} placeholder="0000000000" />}
                                </Field>
                            </DlFormItem>
                        </div>
                        <div className={cx(st.item, st.flex)}>
                            <DlFormItem dark className={st.formItem} label="Логин" required>
                                <Field name="login">
                                    {data => <DlInput dark {...data} autoFocus placeholder="Логин..." />}
                                </Field>
                            </DlFormItem>
                            <DlFormItem dark className={st.formItem} label="Пароль" required>
                                <Field name="password">
                                    {data => <DlInput dark placeholder="Пароль..." {...data} />}
                                </Field>
                            </DlFormItem>
                        </div>
                        <div className={cx(st.item, st.actions)}>
                            <div className={st.action}>
                                <DlButton fullWidth originalType="submit" loading={isSubmitting} type="success">
                                    <span>Создать аккаунт</span>
                                </DlButton>
                            </div>
                            <div className={st.action}>
                                <DlButton fullWidth outlined onClick={() => push("/passport/login")}>Войти</DlButton>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

Register.getLayout = page => <PassportLayout>{page}</PassportLayout>

export default Register
