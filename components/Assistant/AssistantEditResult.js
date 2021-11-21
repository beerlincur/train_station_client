import PropTypes from 'prop-types'
import { useState } from 'react'
import DlInput from '../Shared/Input'

const AssistantEditResult = props => {

    // * STATE
    const [result, setResult] = useState("")

    // * HOOKS

    // * METHODS
    const onResultBlur = () => {
        if (typeof props.onSave === 'function') {
            props.onSave(result)
        }
    }

    return (
        <div>
            <DlInput
                placeholder="Введите сюда..."
                value={result}
                onChange={e => setResult(e.target.value)}
                disabled={props.disabled}
                isLoading={props.isLoading}
                onBlur={onResultBlur}
            />
        </div>
    )
}

AssistantEditResult.propTypes = {
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    onSave: PropTypes.func,
}

export default AssistantEditResult
