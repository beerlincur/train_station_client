import React from 'react'
import PropTypes from 'prop-types'
import st from "./Input.module.css"
import cx from 'classnames'

const DlInput = (props) => {

    const {
        field = {},
        form = {},
        value,
        onChange,
        error,
        wrapperClass,
        inputClass,
        dark,
        SuffixIcon,
        onSuffix,
        noedit,
        errorStyles,
        isFocused,
        isLoading,
        ...rest
    } = props;
    
    const { touched, errors } = form;
    const hasError = error || ((touched && touched[field.name]) && (errors && errors[field.name]))

    const handleChange = ev => {
        if (!noedit && typeof onChange === 'function')
            onChange(ev)
    }

    return (
        <div className={cx(st.input, { [st.isDark]: dark }, wrapperClass)}>
            <input
                type={props.type || "text"}
                className={cx(st.inner, {
                    [st.innerDark]: dark,
                    [st.noedit]: noedit,
                    [st.disabled]: props.disabled,
                    [st.hasSuffix]: !!SuffixIcon,
                    [st.innerFocus]: isFocused,
                    [st.isLoading]: isLoading,
                }, inputClass)}
                value={value || ""}
                onInput={handleChange}
                {...field}
                {...rest}
            />

            {!!SuffixIcon &&
                <div className={st.suffixIcon} onClick={onSuffix}>
                    <SuffixIcon />
                </div>
            }


            {hasError &&
                <div className={st.errorWrapper}>
                    <span className={st.error} style={errorStyles}>{error || errors[field.name]}</span>
                </div>
            }
        </div>
    )
}

DlInput.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    inputClass: PropTypes.string,
    wrapperClass: PropTypes.string,
    disabled: PropTypes.bool,
    dark: PropTypes.bool,
    onChange: PropTypes.func,
}

export default DlInput
