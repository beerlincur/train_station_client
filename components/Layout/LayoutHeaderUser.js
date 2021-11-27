import st from './LayoutHeaderUser.module.css'
import Link from "next/link"
import { useSelector } from "react-redux";
import {getUserInitials, ROLE_RUSSIAN} from '../../utils/utils';

const LayoutHeaderUser = () => {
    const { currentUser } = useSelector(state => state.user)
    return (
        <Link href="/passport/account">
            <a className={st.main}>
                <div className={st.avatar}>{getUserInitials(currentUser)}</div>
                <div className={st.info}>
                    <div className={st.name}>{currentUser.first_name + " " + currentUser.second_name}</div>
                    <div className={st.phone}>{ROLE_RUSSIAN[currentUser.role_id]}</div>
                </div>
            </a>
        </Link>
    )
}

LayoutHeaderUser.propTypes = {

}

export default LayoutHeaderUser
