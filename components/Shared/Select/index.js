import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import st from './Select.module.css'

const DlSelect = props => {
    const { options = [], field = {}, form = {}, value, onChange, error, dark, ...rest } = props;
    
    const { touched, errors } = form;
    const hasError = error || ((touched && touched[field.name]) && (errors && errors[field.name]))

    const handleSelect = (ev) => {
        if (typeof onchange === 'function') onChange(ev)
    }

    return (
        <div className={st.wrapper}>
            <select
                className={cx(st.select, { [st.selectDark]: dark, [st.disabled]: props.disabled })}
                name={props.name}
                id={props.id}
                onSelect={handleSelect}
                {...rest}
                {...field}>
                <option value="" className={st.option}>select from list...</option>
                {options.map((item, i) => (
                    <option className={st.option} value={item.value} key={i}>{item.label}</option>
                ))}
            </select>
            {hasError &&
                <div className={st.error}>{error || errors[field.name]}</div>
            }
        </div>
    )
}

DlSelect.propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    id: PropTypes.string,
    dark: PropTypes.bool,
}

export default DlSelect
