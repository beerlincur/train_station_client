import st from "./PassportLayout.module.css";
import cx from 'classnames'
import { FEEDBACK_EMAIL } from '../../utils/constants';

const PassportLayout = props => {
    return (
        <div className={st.bg}>
            <div className={st.mask} />
            <div className={cx(st.circle, st.fantastic)} />
            <div className={cx(st.circle, st.hot)} />
            <div className={cx(st.circle, st.cool)} />
            <div className={cx(st.background, st.leftBottom)} />
            <div className={cx(st.background, st.topCenter)} />
            <div className={cx(st.background, st.rightBottom)} />

            <div className={st.content}>
                <div className={st.title}>DokuchaevLab</div>
                <div className={st.inner}>
                    <div className={st.glass}>
                        {props.children}
                    </div>
                    <footer className={st.footer}>
                        <div className={st.copyrights}>&copy; {new Date().getFullYear()}. DokuchaevLab</div>
                        <div className={st.emailUs}>
                            <a className={st.footerLink} href={`mailto:${FEEDBACK_EMAIL}`} target="_blank">Написать нам</a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}

PassportLayout.propTypes = {

}

export default PassportLayout
