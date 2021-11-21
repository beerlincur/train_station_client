import Link from 'next/link'
import { useEffect, useState } from 'react'
import LayoutHeaderUser from '../../components/Layout/LayoutHeaderUser'
import LayoutNavLink from '../../components/Layout/LayoutNavLink'
import DlIcon from '../../components/Shared/Icon'
import st from './DefaultLayoutHeader.module.css'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";
import {ROLE} from "../../utils/utils";


const DefaultLayoutHeader = () => {
    const { pathname } = useRouter()

    const [menuOpened, setMenuOpened] = useState(false);

    const { currentUser } = useSelector(state => state.user);


    useEffect(() => {
        if (menuOpened) {
            setMenuOpened(false)
        }
    }, [pathname])

    const onIconClick = () => {
        setMenuOpened(!menuOpened)
    }

    return (
        <div className={st.main}>
            <Link href="/">
                <a className={st.title}>DokuchaevLab</a>
            </Link>
            <div className={cx(st.links, { [st.active]: menuOpened })}>
                <div className={st.link}>
                    <LayoutNavLink title="Заявки" icon="request" href="/" activeLinks={["/", "/applications/[pid]", "/applications/create"]} />
                </div>
                {currentUser.role === ROLE.admin ?
                    <div className={st.link}>
                        <LayoutNavLink title="QR-коды" icon="qr-code" href="/qr-codes" />
                    </div>
                    :
                    (currentUser.role === ROLE.laboratory ?
                        <div className={st.link}>
                            <LayoutNavLink title="Лаборанты" icon="laborants" href="/assistants" />
                        </div>
                        :
                        <>
                        </>
                        // <div className={st.link}>
                        //     <LayoutNavLink title="Уведомления" icon="notification" />
                        // </div>
                    )
                }
                <div className={st.link}>
                    <LayoutNavLink title="Настройки" icon="settings" href="/passport/account" />
                </div>
            </div>
            {menuOpened && <div className={st.linksMask} onClick={() => setMenuOpened(false)} />}

            <div className={st.profile}>
                <LayoutHeaderUser />
                <div className={st.menuIcon} onClick={onIconClick}>
                    {menuOpened ?
                        <DlIcon name="close" />
                        :
                        <DlIcon name="menu" />
                    }
                </div>
            </div>
        </div>
    )
}

export default DefaultLayoutHeader
