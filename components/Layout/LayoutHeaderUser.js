import st from './LayoutHeaderUser.module.css'
import Link from "next/link"
import { useSelector } from "react-redux";
import { getDisplyedPhoneNumber, getUserInitials } from '../../utils/utils';

const userRoles = {
    'admin': 'Администратор',
    'courier': 'Курьер',
    'individual': 'Заказчик',
    'company': 'Юр. лицо',
    'laboratory': 'Лаборатория',
    'assistant': 'Сотрудник лаборатории',
}

const LayoutHeaderUser = () => {
    const { currentUser } = useSelector(state => state.user)
    return (
        <Link href="/passport/account">
            <a className={st.main}>
                <div className={st.avatar}>{getUserInitials(currentUser)}</div>
                <div className={st.info}>
                    <div className={st.name}>{currentUser.first_name + " " + currentUser.last_name}</div>
                    <div className={st.phone}>{getDisplyedPhoneNumber(currentUser.phone)}</div>
                    <div className={st.role}>{userRoles[currentUser.role]}</div>
                </div>
            </a>
        </Link>
    )
}

LayoutHeaderUser.propTypes = {

}

export default LayoutHeaderUser
