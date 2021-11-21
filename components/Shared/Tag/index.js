import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import st from "./tag.module.css"
import DlIcon from '../Icon'

const DlTag = ({ type = 'default', title, size = "md", dark, ...props }) => {
  return (
    <span className={cx(st.tag, st[type], st[size], {[st.hoverable]: props.onClick, [st.dark]: dark, [st.full]: props.fullWidth})} onClick={props.onClick}>
      {props.children ? props.children : <span className={st.title}>{title}</span>}
      {props.onDelete &&
        <span className={st.delete}>
          <DlIcon onClick={props.onDelete} size={20} name="close" />
        </span>
      }
    </span>
  )
}

DlTag.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  fullWidth: PropTypes.bool,
}

export default DlTag
