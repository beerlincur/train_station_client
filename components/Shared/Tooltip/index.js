import PropTypes from 'prop-types'
import st from './Tooltip.module.css'
import cx from 'classnames'
import TooltipContent from './TooltipContent'
import { useEffect, useRef, useState } from 'react'

const initialPositionState = {
    top: 'auto',
    left: 'auto',
    bottom: 'auto',
    right: 'auto',
}

const DlTooltip = props => {
    const { contentStyles = {} } = props;
    const referenceRef = useRef(null)
    
    const [active, setActive] = useState(false)
    const [position, setPosition] = useState(initialPositionState)
    
    // * COMPUTED PROPS
    const isContent = typeof props.content === 'string'
    let tooltipPositionStyles = {
        ...contentStyles,
        top: 'auto',
        left: 'auto',
        bottom: 'auto',
        right: 'auto',
    }
    if (props.position === "top") {
        tooltipPositionStyles = {
            ...tooltipPositionStyles,
            top: `${position.top - 12}px`,
            left: `${position.left + position.width / 2}px`,
            transform: `translate(-50%, -100%)`
        }
    }
    if (props.position === "right") {
        tooltipPositionStyles = {
            ...tooltipPositionStyles,
            top: `${position.top + position.height / 2}px`,
            left: `${position.left + position.width + 12}px`,
            transform: `translate(0%, -50%)`
        }
    }
    if (props.position === "bottom") {
        tooltipPositionStyles = {
            ...tooltipPositionStyles,
            top: `${position.top + position.height + 12}px`,
            left: `${position.left + position.width / 2}px`,
            transform: `translate(-50%, 0%)`
        }
    }
    if (props.position === "left") {
        tooltipPositionStyles = {
            ...tooltipPositionStyles,
            top: `${position.top + position.height / 2}px`,
            left: `${position.left - 12}px`,
            transform: `translate(-100%, -50%)`
        }
    }

    useEffect(() => {
        if (active) {
            window.addEventListener('scroll', updateRefPosition)
        }
        return () => {
            window.removeEventListener('scroll', updateRefPosition)
        }
    }, [active])
    
    const updateRefPosition = () => {
        const reference = referenceRef.current
        if (reference) {
            const { top, left, bottom, right, height, width } = reference.getBoundingClientRect()
            setPosition({ top, left, bottom, right, height, width })
        }
    }
    
    const handleShow = () => {
        updateRefPosition()
        setActive(true)
    }
    
    const handleHide = () => {
        setActive(false)
    }
    
    return (
        <div className={cx(st.tooltip, props.className)} onMouseEnter={handleShow} onMouseLeave={handleHide}>
            {active &&
                <TooltipContent position={props.position} positionStyles={tooltipPositionStyles} isContent={isContent}>
                    {props.content}
                </TooltipContent>
            }
            <div className={st.reference} ref={referenceRef}>{props.children}</div>
        </div>
        )
    }
    
    DlTooltip.propTypes = {
        className: PropTypes.string,
        content: PropTypes.string,
        position: PropTypes.oneOf([
            "left",
            "right",
            "bottom",
            "top",
        ]),
    }
    
    export default DlTooltip
    