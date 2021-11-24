import PropTypes from 'prop-types'
import st from './Document.module.css'
import DlIcon from "../Icon";

const ApplicationsDocument = props => {

    return (
        <div className={st.doc}>
            <div className={st.icon}><DlIcon name={"file"} /></div>
            <div className={st.info}>
                <div className={st.title}>{props.title}</div>
                <div className={st.link_loading}>{props.timeText}</div>
            </div>
        </div>
    )
}

ApplicationsDocument.propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    linkText: PropTypes.string,
    applicationId: PropTypes.number,
    reportType: PropTypes.string
}

export default ApplicationsDocument
