import PropTypes from 'prop-types'
import DlIcon from '../Icon'
import st from './Breadcrumb.module.css'
import cx from 'classnames'
import { useRouter } from 'next/router'

const DlBreadcrumb = props => {
    const { items = [], currentIndex = 1 } = props;
    const { push } = useRouter()
    
    const handleClick = (item) => {
        if (typeof props.onChange === 'function') {
            props.onChange(item.index)
        }
        if (item.path) {
            return push(item.path)
        }
        if (item.href) {
            return window.open(item.href, '_blank')
        }

    }

    return (
        <div className={st.breadcrumb}>
            {items.map((item, i) => (
                <span className={cx(st.item, { [st.link]: item.path || item.href, [st.active]: item.index < currentIndex })} key={i} onClick={() => handleClick(item)}>
                    <span className={st.inner}>{item.title}</span>
                    {!props.separator ?
                        <span className={st.separator}>
                            <DlIcon name="arrow_right" />
                        </span>
                        :
                        <span className={st.separator}>
                            {props.separator}
                        </span>
                    }
                </span>
            ))}
        </div>
    )
}

DlBreadcrumb.propTypes = {
    separator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    items: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number,
        title: PropTypes.string,
        path: PropTypes.string,
        href: PropTypes.string,
    })),
    currentIndex: PropTypes.number,
    onChange: PropTypes.func,
}

export default DlBreadcrumb
