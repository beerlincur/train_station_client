import st from './AlertCardSubtitle.module.css'
import cx from 'classnames'

const AlertCardSubtitle = props => {
    return (
        <div className={cx(st.subtitle, props.className)} style={props.style}>
            {props.children}
        </div>
    )
}

export default AlertCardSubtitle
