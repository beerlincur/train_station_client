import st from './Index.module.css'
import Link from 'next/link'
import UnauthLayoutFooter from './UnauthLayoutFooter'
import DlButton from '../../components/Shared/Button'
import { useRouter } from 'next/dist/client/router'

const UnauthLayout = (props) => {
    const { push } = useRouter()
    return (
        <div className={st.layout}>
            <header className={st.header}>
                <Link href="/">
                    <a className={st.title}>Железнодорожная станция</a>
                </Link>
                <DlButton onClick={() => push("/passport/login")} type="success" size="sm">Войти</DlButton>
            </header>

            <main className={st.content}>
                <div className="container">
                    {props.children}
                </div>
            </main>
        </div>
    )
}

export default UnauthLayout
