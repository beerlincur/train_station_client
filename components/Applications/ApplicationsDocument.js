import PropTypes from 'prop-types'
import st from './ApplicationsDocument.module.css'
import DlIcon from '../Shared/Icon'
import applicationActions from "../../actions/application";
import {openBase64NewTab} from "../../utils/utils";
import {useDispatch} from "react-redux";
import {useState} from "react";

const ApplicationsDocument = props => {
    const [linkText, setLinkText] = useState(props.linkText || "Распечатать");
    const [isLinkActive, setIsLinkActive] = useState(true);
    const dispatch = useDispatch();
    const onPrint = ev => {
        ev.stopPropagation()
        // const url = props.url || "https://storage.yandexcloud.net/dokuchaevlab/documents/act_of_samples.pdf"
        // window.open(url, '_blank');
        setLinkText("Загрузка...")
        setIsLinkActive(false)
        dispatch(applicationActions.generateReport(props.applicationId, props.reportType, (base64Data) => {
            // window.open("data:application/octet-stream;charset=utf-16le;base64,"+base64Data); // download
            openBase64NewTab(base64Data)
            setLinkText(props.linkText || "Распечатать")
            setIsLinkActive(true)
        }))
    }

    const onClickLoading = ev => {
        ev.stopPropagation()
    }

    return (
        <div className={st.doc}>
            <div className={st.icon}><DlIcon name={"file"} /></div>
            <div className={st.info}>
                <div className={st.title}>{props.title}</div>
                <div onClick={isLinkActive ? onPrint : onClickLoading} className={isLinkActive ? st.link : st.link_loading}>{linkText}</div>
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
