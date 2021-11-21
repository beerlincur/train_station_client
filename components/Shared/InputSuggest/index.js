import PropTypes from 'prop-types'
import st from './InputSuggest.module.css'
import DlInput from '../Input'
import DlIcon from '../Icon'
import cx from 'classnames'
import { useState } from 'react';

const DlInputSuggest = props => {
    const { onSelect, options = [], isLoading, ...rest } = props;
    const [isOpened, setIsOpened] = useState(false)

    // * COMPUTED
    const hasMatch = !!options.find(item => item.label === props.value)

    const handleSelect = op => {
        if (typeof props.onChange === "function") {
            props.onChange(op.label)
        }
        if (typeof onSelect === "function") {
            onSelect(op)
            setIsOpened(false)
        }
    }

    const handleInputFocus = () => {
        setIsOpened(true)
    }

    const handleInputBlur = () => {
        setTimeout(() => {
            setIsOpened(false)
        }, 500);
    }

    return (
        <div className={st.wrapper}>
            <div className={st.input}>
                <DlInput
                    {...rest}
                    onChange={ev => props.onChange(ev.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onSuffix={() => props.onChange("")}
                    SuffixIcon={() =>  hasMatch && <DlIcon name="close" /> }
                />
            </div>
            <div className={cx(st.results, { [st.opened]: props.value.length > 2 && isOpened, [st.isEmpty]: (props.value.length > 2 && options.length === 0)})}>
                {options.map((option, i) => (
                    <div className={st.option} key={i} onClick={() => handleSelect(option)}>{option.label}</div>
                ))}
                {options.length === 0 &&
                <>
                    { isLoading ?
                        <div className={st.empty}>Загрузка...</div>
                        :
                        <>
                            {props.value.length > 2 && <div className={st.empty}>Нет данных!</div>}
                        </>
                    }
                    
                </>
                
                }
            </div>
        </div>
    )
}

DlInputSuggest.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    isLoading: PropTypes.bool,
}

export default DlInputSuggest
