import PropTypes from 'prop-types'
import st from './Checkbox.module.css'
import cx from 'classnames'
import { useState } from 'react'

const DlCheckbox = props => {

    const [focused, setFocused] = useState(false)

    const handleChange = (ev) => {
        if (typeof props.onChange === 'function') {
            props.onChange(ev.target.checked)
        }
        if (typeof props.onInput === 'function') {
            props.onInput(ev.target.checked)
        }
    }

    return (
        <label className={cx(st.checkbox, { [st.labeled]: !!props.children || !!props.label })}>
            <input
                type="checkbox"
                className={st.input}
                checked={props.value}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <span className={cx(st.inner, {[st.focused]: focused, [st.checked]: props.value})} />
            {(!!props.children || !!props.label) &&
                <span className={st.label}>
                    {props.children || props.label }
                </span>
            }
        </label>
    )
}

DlCheckbox.propTypes = {
    value: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
}

export default DlCheckbox
