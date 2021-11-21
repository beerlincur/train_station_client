import PropTypes from 'prop-types'
import DlFormItem from '../Shared/FormItem/FormItem'
import DlSelectAdvanced from '../Shared/SelectAdvanced'
import st from './CourierAddSample.module.css'

const ClientAddMarker = props => {

    const { markerOptions = [] } = props;
    return (
        <div className={st.formAdd}>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Метод сбора">
                    <DlSelectAdvanced
                        placeholder="Выберите из списка..."
                        options={markerOptions}
                        inputId={`input-0001`}
                        defaultValue={markerOptions[0]}
                        value={props.value}
                        onSelect={props.onSelect}
                        emptyMessage="Нет совпадений!"
                        isClearable
                    />
                </DlFormItem>
            </div>
        </div>
    )
}

ClientAddMarker.propTypes = {
    value: PropTypes.object,
    markerOptions: PropTypes.array,
    onSelect: PropTypes.func,
}

export default ClientAddMarker
