import { shallowEqual, useSelector } from "react-redux"
import st from "./Clock.module.css"
import cx from 'classnames'

const useClock = () => {
  return useSelector(
    (state) => ({
      lastUpdate: state.lastUpdate,
      light: state.light,
    }),
    shallowEqual
  )
}

const formatTime = (time) => {
  // cut off except hh:mm:ss
  return new Date(time).toJSON().slice(11, 19)
}

const Clock = () => {
  const { lastUpdate, light } = useClock();
  return (
    <div className={cx(st.item, {[st.light] : light})}>
      lastUpdate: {formatTime(lastUpdate)}
    </div>
  )
}

export default Clock
