import st from './AlertCardTitle.module.css'
import cx from 'classnames'

const AlertCardTitle = props => {
    return (
        <div className={cx(st.title, props.className)} style={props.style}>
            {props.children}
        </div>
    )
}

export default AlertCardTitle
