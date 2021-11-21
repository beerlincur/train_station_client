import React, { Children } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import st from "./Button.module.css"
import DlIcon from '../Icon'

const DlButton = props => {
    const {
        children,
        type = 'default',
        size = "md",
        color,
        bgColor,
        disabled,
        outlined,
        circle,
        icon,
        flat,
        fullWidth,
        loading,
        isLink,
        originalType,
        className,
        ...rest
    } = props;

    let renderedChildren = children;
    if (loading) {
        renderedChildren = Children.toArray(children).filter(x => !x.props || x.props.__TYPE !== 'DlIcon')
    }
    const hasIcon = Children.toArray(children).filter(x => x.props && x.props.__TYPE === 'DlIcon').length > 0

    const styles = {}
    if (color) styles.color = color;
    if (bgColor) styles.backgroundColor = bgColor;

    const classnames = cx(
        'dl-btn', st.btn, [st[type], st[size], className, {
            [st.withIcon]: hasIcon,
            [st.circle]: circle,
            [st.icon]: icon,
            ['dl-btn--icon']: icon,
            [st.loading]: loading,
            [st.outlined]: outlined,
            [st.flat]: flat,
            [st.fullWidth]: fullWidth,
        }]);
    const otherProps = {
        disabled,
        style: styles,
    }
    if (isLink) {
        return (
            <a
                className={classnames}
                {...otherProps}
                {...rest}
            >
                {loading && <DlIcon className={st.spinner} name="spinner" />}
                {renderedChildren}
            </a>
        )
    }
    return (
        <button
            className={classnames}
            {...otherProps}
            {...rest}
            type={originalType || ""}
        >
            {loading && <DlIcon className={st.spinner} name="spinner" />}
            {renderedChildren}
        </button>
    )
}

DlButton.propTypes = {
    type: PropTypes.oneOf(["primary", "warning", "success", "info", "error", "text", "courrier"]),
    color: PropTypes.string,
    bgColor: PropTypes.string,
    icon: PropTypes.bool,
    isLink: PropTypes.bool,
    size: PropTypes.string,
    circle: PropTypes.bool,
    outlined: PropTypes.bool,
    disabled: PropTypes.bool,
    flat: PropTypes.bool,
    fullWidth: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
}

export default DlButton
