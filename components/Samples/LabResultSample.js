import PropTypes from 'prop-types'
import DlFormItem from '../Shared/FormItem/FormItem';
import DlInput from '../Shared/Input';
import DlSelectAdvanced from '../Shared/SelectAdvanced';
import st from './CourierAddSample.module.css'
import { get as _get } from 'lodash'
import { useEffect } from 'react';

const LabResultSample = props => {

    const { result = {}, samplesOptions = [], errors = {} } = props;


    useEffect(() => {
        // set default values
        if (typeof props.onChange === 'function') {
            const sample = samplesOptions.find(i => i.id === (result.sample && result.sample.id))
            props.onChange({
                ...result,
                value: result.value || "",
                sample: sample || samplesOptions[0]
            })
        }
    }, [])

    const handleChange = (key, value) => {
        console.log(`key`, value)
        if (typeof props.onChange === "function") {
            props.onChange({
                ...result,
                [key]: value
            })
        }
    }

    return (
        <div className={st.formAdd}>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Маркировка пробы">
                    <DlSelectAdvanced
                        options={samplesOptions}
                        inputId={`input-0001`}
                        value={result.sample || {}}
                        onSelect={(item) => handleChange('sample', item)}
                        emptyMessage="Нет совпадений!"
                        isClearable={true}
                        error={errors.sample}
                    />
                </DlFormItem>
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Показатель">
                    <DlInput
                        disabled
                        placeholder="Показатель..."
                        value={_get(result, 'marker.title', "")}
                    />
                </DlFormItem>
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Результат">
                    <DlInput
                        value={result.value || ""}
                        onChange={(ev) => handleChange('value', ev.target.value)}
                        placeholder="???"
                        error={errors.value}
                    />
                </DlFormItem>
            </div>
        </div>
    )
}

LabResultSample.propTypes = {
    value: PropTypes.shape({
        sample: PropTypes.object,
        result: PropTypes.string,
    }),
    onChange: PropTypes.func,
    samplesOptions: PropTypes.array,
}

export default LabResultSample
