import PropTypes from 'prop-types'
import st from './DlNotif.module.css'
import cx from 'classnames'
import DlIcon from '../Icon';
import { domName } from './index'
import { useEffect, useRef } from 'react';
import DlButton from '../Button';

const icons = {
  success: 'done',
  error: 'error',
  default: '',
  warning: 'report',
}
const DlNotification = props => {
  const ref = useRef(null)
  const { type = "default", bottom = 24, title } = props;
  const canClose = props.onClose || props.showClose

  useEffect(() => {
    if (props.duration && ref.current) {
      setTimeout(() => {
        initClose()
      }, props.duration);
    }
  }, [])

  const initClose = () => {
    const height = ref.current && ref.current.offsetHeight
    const bottom = ref.current && parseInt(ref.current.style.bottom, 10)
    if (typeof props.close === "function") {
      props.close.call(height, bottom, props.id)
    }
  }

  return (
    <div className={cx(st.container, st[type])} data-name={domName} style={{ bottom }} ref={ref} id={props.id}>
      {!!icons[type] &&
        <div className={st.icon}>
          <DlIcon name={icons[type]} />
        </div>
      }
      <div className={st.message}>{title}</div>
      {canClose &&
        <div className={cx(st.icon, st.left)} onClick={initClose}>
          <DlIcon name="close" />
        </div>
      }
      {props.onPositive &&
        <DlButton onClick={props.onPositive}>Да</DlButton>
      }
      {props.onNegative &&
        <DlButton onClick={props.onNegative}>НЕТ</DlButton>
      }
    </div>
  )
}

DlNotification.propTypes = {
  type: PropTypes.oneOf(["success", "error", "info", "warning", "default"]),
  showClose: PropTypes.bool,
}

export default DlNotification
