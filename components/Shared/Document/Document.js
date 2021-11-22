import PropTypes from 'prop-types'
import st from './Document.module.css'
import {useDispatch} from "react-redux";
import {useState} from "react";
import DlIcon from "../Icon";

const ApplicationsDocument = props => {
    const [linkText, setLinkText] = useState(props.linkText || "Распечатать");
    const [isLinkActive, setIsLinkActive] = useState(true);
    const dispatch = useDispatch();

    return (
        <div className={st.doc}>
            <div className={st.icon}><DlIcon name={"file"} /></div>
            <div className={st.info}>
                <div className={st.title}>{props.title}</div>
                <div className={isLinkActive ? st.link : st.link_loading}>{linkText}</div>
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
