import st from "./PassportLayout.module.css";
import cx from 'classnames'

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
                <div className={st.title}>Железнодорожная станция</div>
                <div className={st.inner}>
                    <div className={st.glass}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

PassportLayout.propTypes = {

}

export default PassportLayout
