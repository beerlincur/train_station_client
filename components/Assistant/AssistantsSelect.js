import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { labelizeAssistant } from '../../utils/utils'
import DlSelectAdvanced from '../Shared/SelectAdvanced'
import st from "./AssistantsSelect.module.css"

const AssistantsSelect = props => {
    const { assistantsSelectOptions } = useSelector(state => state.laboratory);

    let selectedAssistant = (!!props.marker && !!props.marker.assistant && labelizeAssistant(props.marker.assistant)) || null
    if (props.isLoading) {
        selectedAssistant = null;
    }

    return (
        <div className={st.selector}>
            <DlSelectAdvanced
                placeholder={props.isLoading ? "Загрузка..." : "Не назначен..."}
                options={assistantsSelectOptions}
                value={selectedAssistant}
                emptyMessage="Нет сотрудников!"
                onSelect={props.onSelectAssistant}
                isClearable
            />
        </div>
    )
}

AssistantsSelect.propTypes = {
    applicationId: PropTypes.number,
    marker: PropTypes.object,
    onSelectAssistant: PropTypes.func,
    isLoading: PropTypes.bool,
}

export default AssistantsSelect
