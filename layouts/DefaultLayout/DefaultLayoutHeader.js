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
                <a className={st.title}>Железнодорожная станция</a>
            </Link>
            <div className={cx(st.links, { [st.active]: menuOpened })}>
                {currentUser.role_id === ROLE.admin ? (
                    <>
                        <div className={st.link}>
                            <LayoutNavLink title="Все рейсы" icon="request" href="/" activeLinks={["/"]} />
                        </div>
                        <div className={st.link}>
                            <LayoutNavLink title="Проводники" icon="laborants" href="/conductors" />
                        </div>
                        <div className={st.link}>
                            <LayoutNavLink title="Поезда" icon="request" href="/trains" />
                        </div>
                        <div className={st.link}>
                            <LayoutNavLink title="Станции" icon="request" href="/stations" />
                        </div>
                    </>
                    )
                    :
                    (currentUser.role_id === ROLE.conductor ?
                        <>
                            <div className={st.link}>
                                <LayoutNavLink title="Все рейсы" icon="request" href="/" activeLinks={["/"]} />
                            </div>
                            <div className={st.link}>
                                <LayoutNavLink title="Мои маршруты" icon="laborants" href="/conductor" />
                            </div>
                        </>
                        :
                        <>
                            <div className={st.link}>
                                <LayoutNavLink title="Все рейсы" icon="request" href="/" activeLinks={["/"]} />
                            </div>
                            <div className={st.link}>
                                <LayoutNavLink title="Направления" icon="request" href="/roads" />
                            </div>
                        </>
                    )
                }
                <div className={st.link}>
                    <LayoutNavLink title="Личный кабинет" icon="settings" href="/passport/account" />
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
