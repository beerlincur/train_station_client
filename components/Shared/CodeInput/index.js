import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import InputMask from "react-input-mask"
import { replaceMaskWithNumber } from '../../../utils/utils';
import DlInput from "../Input";
import st from './CodeInput.module.css'

const getCodeValue = (num, i) => num[i] || ""

const CodeInput = props => {
    const digitsRef = useRef(null)

    const { length = 4 } = props;


    useEffect(() => {
        const code = replaceMaskWithNumber(props.value)

        if (code.length > 0) {
            const codeContainer = digitsRef.current;
            const nextInput = codeContainer.querySelectorAll("input")[code.length]
            if (nextInput) {
                nextInput.focus()
            }
            if (code.length === 4) {
                if (typeof props.onSubmit === "function") {
                    props.onSubmit()
                }
            }
        }
    }, [props.value])


    const handleCodeChange = (index, val) => {
        const newVal = `${props.value.slice(0, index)}${val}`
        if (typeof props.onChange === 'function') {
            props.onChange(newVal)
        }
    }

    return (
        <div ref={digitsRef} className={st.code}>
            <InputMask
                mask="9"
                alwaysShowMask
                placeholder="0"
                value={getCodeValue(props.value, 0)}
                onChange={ev => handleCodeChange(0, ev.target.value)}
            >
                {() => <DlInput type={"tel"} dark autoFocus wrapperClass={st.item} />}
            </InputMask>
            <InputMask
                mask="9"
                alwaysShowMask
                placeholder="0"
                value={getCodeValue(props.value, 1)}
                onChange={ev => handleCodeChange(1, ev.target.value)}
            >
                {() => <DlInput type={"tel"} dark wrapperClass={st.item} />}
            </InputMask>
            <InputMask
                mask="9"
                alwaysShowMask
                placeholder="0"
                value={getCodeValue(props.value, 2)}
                onChange={ev => handleCodeChange(2, ev.target.value)}
            >
                {() => <DlInput type={"tel"} dark wrapperClass={st.item} />}
            </InputMask>

            <InputMask
                mask="9"
                alwaysShowMask
                placeholder="0"
                value={getCodeValue(props.value, 3)}
                onChange={ev => handleCodeChange(3, ev.target.value)}
            >
                {() => <DlInput type={"tel"} dark wrapperClass={st.item} />}
            </InputMask>
        </div>
    )
}

CodeInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    length: PropTypes.number,
}

export default CodeInput
