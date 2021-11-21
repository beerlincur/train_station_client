import React, { Children } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ActiveLink = ({ children, activeClassName, activeLinks = [], ...props }) => {
    const { pathname } = useRouter()

    const child = Children.only(children)
    const childClassName = child.props.className || ''

    const isActive = activeLinks.includes(pathname) || pathname === props.href || pathname === props.as
    const className = isActive ? `${childClassName} ${activeClassName}`.trim() : childClassName

    return (
        <Link {...props}>
            {React.cloneElement(child, {
                className: className || null,
            })}
        </Link>
    )
}

ActiveLink.propTypes = {
    activeClassName: PropTypes.string.isRequired,
}

export default ActiveLink
