import React from 'react'
import PropTypes from 'prop-types'
import st from "./MaskedInput.module.css"
import cx from 'classnames'
import InputMask from 'react-input-mask'
import DlInput from '../Input'

const MaskedInput = ({ mask, value, onChange, error, wrapperClass, inputClass, ...props }) => {
  const handleChange = ev => {
    if (onChange)
      onChange(ev)
  }
  return (
    <InputMask
      mask={mask}
      className={cx(st.input, wrapperClass)}
      value={value}
      onChange={handleChange}
    >
      {() => <DlInput />}
    </InputMask>
  )
}

MaskedInput.propTypes = {
  value: PropTypes.string,
  inputClass: PropTypes.string,
  wrapperClass: PropTypes.string,
  onChange: PropTypes.func,
}

export default MaskedInput
