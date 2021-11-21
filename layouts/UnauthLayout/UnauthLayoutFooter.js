import st from './UnFooter.module.css'
import Link from 'next/link'
import { FEEDBACK_EMAIL } from '../../utils/constants'

const UnauthLayoutFooter = () => {
    return (
        <footer className={st.footer}>
            <div className={st.copyrights}>&copy; {new Date().getFullYear()}. DokuchaevLab</div>
            <div className={st.terms}>
                Наши условия <Link href="/terms-of-service"><a className={st.link} target="_blank">использования</a></Link>&nbsp;
                и <Link href="/privacy-policy"><a className={st.link} target="_blank">конфиденциальности</a></Link>
            </div>
            <div className={st.emailUs}>
                <a className={st.link} href={`mailto:${FEEDBACK_EMAIL}`} target="_blank">Написать нам</a>
            </div>
        </footer>
    )
}

export default UnauthLayoutFooter
