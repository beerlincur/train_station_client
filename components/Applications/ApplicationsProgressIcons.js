import PropTypes from 'prop-types'
import DlIcon from '../Shared/Icon'
import st from './AppProgress.module.css'
import cx from 'classnames'
import _ from 'lodash'
import {STATUS} from "../../utils/utils";

const icons = [
    { name: 'done', status: STATUS.accepted },
    { name: 'delivering', status: [STATUS.to_client, STATUS.courier_selection, STATUS.from_client, STATUS.delivery] },
    { name: 'domain', status: STATUS.analysis },
    { name: 'flag', status: STATUS.finished },
]

const getStatusIndex = (status) => {
    let icon;
    if (typeof status === 'string') {
        icon = icons.find(ic => ic.status.includes(status))
    } else {
        icon = icons.find(ic => _.isEqual(ic.status, status))
    }
    return icons.indexOf(icon)
}

const ApplicationsProgressIcons = props => {
    return (
        <div className={st.progress}>
            {icons.map((icon, i) => (
                <span
                    className={cx(
                        st.icon, {
                            [st.active]: icon.status.includes(props.status),
                            [st.inActive]: props.status === STATUS.canceled || getStatusIndex(icon.status) < getStatusIndex(props.status)
                        },
                        )}
                key={i}>
                    <DlIcon name={icon.name} />
                </span>
            ))}
        </div>
    )
}

ApplicationsProgressIcons.propTypes = {
    status: PropTypes.string,
}

export default ApplicationsProgressIcons
