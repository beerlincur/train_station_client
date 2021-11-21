import PropTypes from 'prop-types'
import DlHeadTitle from '../Shared/HeadTitle'
import st from './LoginInnerLayout.module.css'
import cx from "classnames"

const LoginInnerLayout = ({ title, ...props }) => {
  
  // * COMPUTED
  const btnLength = [props.successBtn, props.defaultBtn].filter(i => !!i).length
  
  return (
    <div className={st.login}>
      <DlHeadTitle title="Вход" />
      <h1 className={st.title}>{title}</h1>
      {props.children}
      <div className={cx(st.item, st.actions, st[`is-${btnLength}`])}>
        {props.successBtn}
        {props.defaultBtn}
      </div>
      <div className={cx(st.item, st.terms)}>
        Нажимая на кнопку «Получить код», вы принимаете условия  <a href="/privacy-policy" target="_blank">Политики обработки и защиты персональных данных</a>, даю  согласие на <a href="/terms-of-service" target="_blank">обработку персональных данных</a>
      </div>
    </div>
  )
}

LoginInnerLayout.propTypes = {
  title: PropTypes.string,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
}

export default LoginInnerLayout
