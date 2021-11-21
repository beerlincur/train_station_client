import st from './AlertCardSupertitle.module.css'
import cx from 'classnames'

const AlertCardSupertitle = props => {
    return (
        <div className={cx(st.supertitle, props.className)} style={props.style}>
            {props.children}
        </div>
    )
}

export default AlertCardSupertitle

