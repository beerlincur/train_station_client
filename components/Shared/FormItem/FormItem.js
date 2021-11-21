import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import st from "./FormItem.module.css"

const DlFormItem = ({ children, id, label, required, dark, multiple, hideLabel, ...props }) => {
    return (
        <div className={cx(st.item, { [st.isDark]: dark, [st.multiple]: multiple }, props.className)}>
            <label className={cx(st.label, { [st.hide]: hideLabel })} htmlFor={id}>
                {label}
                <sup className={cx(st.required, { [st.show]: required })}>*</sup>
            </label>
            <div className={cx(st.inner, props.innerClassName)}>
                {children}
            </div>
        </div>
    )
}

DlFormItem.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    innerClassName: PropTypes.string,
    fullWidth: PropTypes.bool,
    required: PropTypes.bool,
    hideLabel: PropTypes.bool,
    dark: PropTypes.bool,
}

export default DlFormItem
