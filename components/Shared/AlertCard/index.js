import PropTypes from 'prop-types'
import st from './AlertCard.module.css'
import cx from 'classnames'
import DlIcon from '../Icon'
import DlButton from '../Button'

const AlertCard = props => {
    const { type = 'primary', onIconClick } = props;
    return (
        <div className={cx(st.card, [st[type]], props.className)}>
            {typeof onIconClick === 'function' &&
                <div className={st.icon}>
                    <DlButton icon circle size="xs" type="text" onClick={onIconClick}>
                        <DlIcon name="edit" />
                    </DlButton>
                </div>
            }
            {props.children}
        </div>
    )
}

AlertCard.propTypes = {
    onIconClick: PropTypes.func,
    type: PropTypes.string,
    className: PropTypes.string,
}

export default AlertCard
