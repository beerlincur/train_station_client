import PropTypes from 'prop-types'
import DlTag from '../Shared/Tag'
import st from './TicketItem.module.css'

const TicketInfo = props => {
    return (
        <div className={st.info}>
            {(props.tag && props.tag.label) &&
            <div className={st.tag}>
                <DlTag size="xs" type={props.tag.color} dark={props.tag.dark}>
                    {props.tag.label}
                </DlTag>
            </div>
            }
            <div className={st.number}>{props.numberTitle}</div>
            <div className={st.date}>{props.dateTitle}</div>
        </div>
    )
}

TicketInfo.propTypes = {
    dateTitle: PropTypes.string,
    numberTitle: PropTypes.string,
    tag: PropTypes.object,
}

export default TicketInfo
