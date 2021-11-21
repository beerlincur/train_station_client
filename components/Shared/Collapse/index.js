import PropTypes from 'prop-types'
import cx from 'classnames'
import st from "./Collapse.module.css"
import { useEffect, useRef, useState } from 'react';
import DlIcon from '../Icon'

const DlCollapse = props => {
    const contentRef = useRef(null)
    const { title, isCollapsed = true } = props;

    const [isLocalCollapsed, setIsLocalCollapsed] = useState(true)

    useEffect(() => {
        setIsLocalCollapsed(isCollapsed)
    }, [isCollapsed])
    
    useEffect(() => {
        const content = contentRef.current
        if (content) {
            content.style.maxHeight = isLocalCollapsed ? null : `${content.scrollHeight}px`;
        }
    }, [isLocalCollapsed])

    const handleCollapse = () => {
        setIsLocalCollapsed(!isLocalCollapsed)
        if (typeof props.onToggle === "function") props.onToggle(!isLocalCollapsed)
    }

    return (
        <div className={cx(st.section, { [st.collapsed]: isLocalCollapsed })}>
            <div className={st.inner}>
                <div className={st.title} onClick={handleCollapse}>
                    <span>{title}</span>
                    <span className={st.titleIcon}>
                        <DlIcon name={isLocalCollapsed ? "keyboard_arrow_up" : "keyboard_arrow_up"} size="20" />
                    </span>
                </div>
                <div className={st.content} ref={contentRef}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

DlCollapse.propTypes = {
    title: PropTypes.string,
    isCollapsed: PropTypes.bool,
    onToggle: PropTypes.func,
}

export default DlCollapse
