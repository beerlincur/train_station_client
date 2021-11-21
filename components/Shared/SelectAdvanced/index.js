import React from 'react'
import PropTypes from 'prop-types'
import RSelect from 'react-select'
import st from './Select.module.css'

const getCustomStyles = (controlStyles, isHovered, isFocused) => {
    return {
        control: (provided) => {
            return {
                ...provided,
                ...controlStyles,
                // alignItems: "center",
                // backgroundColor: "hsl(0, 0%, 100%)",
                borderColor: isFocused ? "#0085FF" : (isHovered ? "hsl(0, 0%, 60%)" : "#E8E8E8"),
                borderRadius: 12,
                // borderStyle: "solid",
                borderWidth: 2,
                // boxShadow: "0 0 0 1px #2684FF",
                // boxSizing: "border-box",
                // cursor: "default",
                // display: "flex",
                flexWrap: "nowrap",
                // justifyContent: "space-between",
                // label: "control",
                minHeight: 48,
                height: 48,
                width: '100%',
                // outline: "0 !important",
                // position: "relative",
                // transition: "all 100ms",
            }
        },
        valueContainer: (provided, state) => {
            return {
                ...provided,
                // WebkitOverflowScrolling: "touch",
                // alignItems: "center",
                // boxSizing: "border-box",
                display: "flex",
                // flex: 1,
                flexWrap: "nowrap",
                // overflow: "hidden",
                // padding: "2px 8px",
                // position: "relative",
            }
        },
        singleValue: (provided, state) => {
            return {
                ...provided,
                // boxSizing: "border-box",
                // color: "hsl(0, 0%, 20%)",
                // label: "singleValue",
                // marginLeft: 2,
                // marginRight: 2,
                // maxWidth: "calc(100% - 8px)",
                // overflow: "hidden",
                position: "relative",
                // textOverflow: "ellipsis",
                top: "auto",
                // transform: "translateY(-50%)",
                // whiteSpace: "nowrap",
                transform: 'translateY(0%)',
            }
        },
        indicatorSeparator: (provided, state) => {
            return {
                // ...provided,
                // boxSizing: "border-box",
                // color: "hsl(0, 0%, 20%)",
                // label: "singleValue",
                // marginLeft: 2,
                // marginRight: 2,
                // maxWidth: "calc(100% - 8px)",
                // overflow: "hidden",
                // position: "relative",
                // textOverflow: "ellipsis",
                // top: "auto",
                // transform: "translateY(-50%)",
                // whiteSpace: "nowrap",
                display: 'none',
            }
        },
    }
}

const DlSelectAdvanced = props => {
    const { options = [], field = {}, form = {}, error, dark, inputStyles, isHovered, isFocused, ...rest } = props;

    const { touched, errors } = form;
    const hasError = error || ((touched && touched[field.name]) && (errors && errors[field.name]))

    const handleChange = (item) => {
        if (typeof props.onSelect === 'function') props.onSelect(item)
    }

    return (
        <div className={st.wrapper}>
            <div className={st.selectInner}>
                <RSelect
                    options={options}
                    styles={getCustomStyles(inputStyles, isHovered, isFocused)}
                    onChange={handleChange}
                    noOptionsMessage={() => props.emptyMessage}
                    {...rest}
                />
            </div>
            {hasError && <div className={st.error}>{error}</div>}
        </div>
    )
}

DlSelectAdvanced.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string
    })),
    name: PropTypes.string,
    emptyMessage: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
    dark: PropTypes.bool,
    isDisabled: PropTypes.bool,
    openMenuOnFocus: PropTypes.bool,
    openMenuOnClick: PropTypes.bool,
    onSelect: PropTypes.func,
    onInputChange: PropTypes.func,
    value: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string
    }),
    defaultValue: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string
    }),
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onMenuClose: PropTypes.func,
    onMenuOpen: PropTypes.func,
    onMenuScrollToBottom: PropTypes.func,
    onMenuScrollToTop: PropTypes.func,
}

export default DlSelectAdvanced
