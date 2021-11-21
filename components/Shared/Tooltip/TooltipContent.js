import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import cx from 'classnames'
import st from './Tooltip.module.css'
import { capitalize as _capitalize } from 'lodash'
import { useEffect, useRef } from 'react'

const TooltipContent = props => {
    
    const tooltipRef = useRef(document.createElement('div'))
    const tooltipEl = tooltipRef.current;

    useEffect(() => {
        document.body.appendChild(tooltipEl)
        return () => {
            document.body.removeChild(tooltipEl)
        }
    }, [])

    return ReactDOM.createPortal(
        <div className={cx(st.content)} style={props.positionStyles}>
            <div className={cx(st.contentInner, { [st.isContent]: props.isContent, [st[`is${_capitalize(props.position)}`]]: props.position })}>{props.children}</div>
        </div>,
        tooltipEl
    )
}

TooltipContent.propTypes = {
    position: PropTypes.string,
    positionStyles: PropTypes.object,
    isContent: PropTypes.bool,
}

export default TooltipContent
