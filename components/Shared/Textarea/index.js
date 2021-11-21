import PropTypes from 'prop-types'
import st from './Textarea.module.css'
import cx from 'classnames'

const DlTextarea = props => {
    const { field = {}, form = {}, value, onChange, error, wrapperClass, innerClass, dark, ...rest } = props;

    const { touched, errors } = form;
    const hasError = error || ((touched && touched[field.name]) && (errors && errors[field.name]))

    const handleChange = ev => {
        if (onChange)
            onChange(ev)
    }

    return (
        <div className={cx(st.textarea, wrapperClass)}>
            <textarea
                className={cx(st.inner, { [st.disabled]: props.disabled, [st.innerDark]: dark}, innerClass)}
                value={value}
                onInput={handleChange}
                {...field}
                {...rest}
            />
            {hasError &&
                <div className={st.error}>{error || errors[field.name]}</div>
            }
        </div>
    )
}

DlTextarea.propTypes = {
    value: PropTypes.string,
    innerClass: PropTypes.string,
    wrapperClass: PropTypes.string,
    dark: PropTypes.bool,
    onChange: PropTypes.func,
}

export default DlTextarea
