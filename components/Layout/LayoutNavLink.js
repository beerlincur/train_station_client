import ActiveLink from "../Shared/ActiveLink"
import DlIcon from "../Shared/Icon"
import st from './LayoutNavLink.module.css'
import PropTypes from "prop-types";

const LayoutNavLink = (props) => {
  return (
      <>
      {props.href ?
        <ActiveLink {...props} className={st.main} activeClassName={st.active}>
        <a className={st.link}>
            <span className={st.icon}>
            <DlIcon name={props.icon} />
            </span>
            <span className={st.linkTitle}>{props.title}</span>
        </a>
        </ActiveLink>
        :
        <a className={st.link}>
            <span className={st.icon}>
            <DlIcon name={props.icon} />
            </span>
            <span className={st.linkTitle}>{props.title}</span>
        </a>
      }
      </>
  )
}

LayoutNavLink.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  href: PropTypes.string,
}

export default LayoutNavLink
