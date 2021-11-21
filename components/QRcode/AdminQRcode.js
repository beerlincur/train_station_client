import st from "./AdminQRcode.module.css";
import Image from 'next/image';
import PropTypes from "prop-types";
import {convertDate} from "../../utils/utils";

const AdminQRCode = props => {
    return (
        <div className={st.adminQRcontainer}>
            <div className={st.marking}>{props.code}</div>
            <div className={st.datetime}>
                <div className={st.date}>{convertDate(props.created_at, { format: "dd.LL.yyyy" })}</div>
                <div className={st.datetimeLine}/>
                <div className={st.time}>{convertDate(props.created_at, { format: "HH:mm" })}</div>
            </div>
            <div className={st.qr}>
                <div>
                    <Image
                        src={`https://storage.yandexcloud.net/dokuchaevlab/qr/${props.code}.svg`}
                        width={256}
                        height={256}
                        alt="QR-код" />
                </div>
            </div>
        </div>
    )
}

AdminQRCode.propTypes = {
    marking: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    qrcodeLink: PropTypes.string,
}

export default AdminQRCode