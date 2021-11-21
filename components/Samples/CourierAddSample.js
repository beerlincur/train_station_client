import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { convertDate } from '../../utils/utils'
import DlFormItem from '../Shared/FormItem/FormItem'
import DlInput from '../Shared/Input'
import DlSelectAdvanced from '../Shared/SelectAdvanced'
import st from './CourierAddSample.module.css'
import DlButton from "../Shared/Button";
import DlIcon from "../Shared/Icon";
import cx from "classnames";

const unitOptions = [
    { label: "л.", value: "л." },
    { label: "кг.", value: "кг." },
    { label: "шт.", value: "шт." },
]

const getUnitObj = val => val && val.value ? val : unitOptions.find(i => i.value === val) || unitOptions[0]

const CourierAddSample = props => {

    const { value = {}, typeOptions = [], methodOptions = [], errors = {} } = props;
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        // default values
        if (typeof props.onChange === 'function') {
            props.onChange({
                ...props.value,
                time: new Date().toISOString(),
                type: typeOptions[0],
                method: methodOptions[0],
                unit: getUnitObj(value.unit)
            })
        }
    }, [])

    const handleChange = (key, value) => {
        if (typeof props.onChange === "function") {
            props.onChange({
                ...props.value,
                [key]: value
            })
        }
    }

    const handleScanClicked = () => {
        if (typeof props.onScanClicked === "function") {
            props.onScanClicked()
        }
    }

    const date = (value && convertDate(value.time, { format: "dd MMMM yyyy" })) || ""
    const time = (value && convertDate(value.time, { format: "HH:mm" })) || ""

    return (
        <div className={st.formAdd}>
            <div className={cx(st.formAddItem, st.formAddItemInline)}>
                <DlFormItem className={st.formAddItemInner} label="Дата отбора">
                    <DlInput value={date} disabled />
                </DlFormItem>
                <DlFormItem className={st.formAddItemInner} label="Время отбора">
                    <DlInput value={time} disabled />
                </DlFormItem>
            </div>
            <div className={cx(st.formAddItem, st.formAddItemInline)}>
                <DlFormItem className={st.formAddItemInner} label="Точка отбора">
                    <DlInput
                        placeholder="-"
                        error={errors.place}
                        value={(value && value.place) || ""}
                        onChange={ev => handleChange('place', ev.target.value)}
                    />
                </DlFormItem>
                <DlFormItem className={st.formAddItemInner} label="Объем">
                    <div className={st.formAddItemVolume}>
                        <div className={st.formAddVol}>
                            <DlInput
                                placeholder="объем..."
                                inputClass={st.formAddVolInput}
                                value={(value && value.volume) || ""}
                                onChange={ev => handleChange('volume', ev.target.value)}
                                errorStyles={{ whiteSpace: "nowrap" }}
                                isFocused={isFocused}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                error={errors.volume}
                            />
                        </div>
                        <div className={st.formAddUnit}>
                            <DlSelectAdvanced
                                isHovered={isHovered}
                                isFocused={isFocused}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className={st.formAddUnitSelect}
                                options={unitOptions}
                                inputId={`input-0003`}
                                // defaultValue={unitOptions[0]}
                                value={(value && getUnitObj(value.unit)) || unitOptions[0]}
                                onSelect={(item) => handleChange('unit', item && item)}
                                emptyMessage="Нет совпадений!"
                                inputStyles={{
                                    borderLeft: 'none',
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    marginLeft: -3,
                                    borderWidth: 1,
                                    zIndex: 0,
                                    '&:focus': {
                                        borderLeft: 'none',
                                    }
                                }}
                            />
                        </div>
                    </div>
                </DlFormItem>
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} multiple label="Маркировка пробы">
                    <DlInput
                        name="marking"
                        placeholder="Вручную или скан..."
                        value={(value && value.marking) || ""}
                        onChange={ev => handleChange('marking', ev.target.value)}
                        error={errors.marking}
                        wrapperClass={st.formAddItemInput}
                    />
                    <DlButton type="primary" onClick={handleScanClicked}><DlIcon name={"qr-code"} />Скан</DlButton>
                </DlFormItem>
                {/* <DlFormItem className={st.formAddItemScan} label="Скан" hideLabel>
                </DlFormItem> */}
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Тара">
                    <DlInput
                        name="sample_container"
                        placeholder="Введите тип тары..."
                        value={(value && value.sample_container) || ""}
                        onChange={ev => handleChange('sample_container', ev.target.value)}
                        error={errors.sample_container}
                    />
                </DlFormItem>
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Метод сбора">
                    <DlSelectAdvanced
                        options={methodOptions}
                        inputId={`input-0001`}
                        defaultValue={methodOptions[0]}
                        value={(value && value.method) || methodOptions[0] || {}}
                        onSelect={(item) => handleChange('method', item && item)}
                        emptyMessage="Нет совпадений!"
                        // isClearable
                    />
                </DlFormItem>
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Тип пробы">
                    <DlSelectAdvanced
                        options={typeOptions}
                        className={st.formAddItemVolume}
                        inputId={`input-0002`}
                        defaultValue={typeOptions[0]}
                        value={(value && value.type) || typeOptions[0] || {}}
                        onSelect={(item) => handleChange('type', item && item)}
                        emptyMessage="Нет совпадений!"
                        // isClearable
                    />
                </DlFormItem>
            </div>
            <div className={st.formAddItem}>
                <DlFormItem className={st.formAddItemInner} label="Подготовка проб">
                    <DlInput
                        name="preparation"
                        placeholder="-"
                        value={(value && value.preparation) || ""}
                        onChange={ev => handleChange('preparation', ev.target.value)}
                    />
                </DlFormItem>
            </div>
        </div>
    )
}

CourierAddSample.propTypes = {
    value: PropTypes.shape({
        application_id: PropTypes.number,
        marker_id: PropTypes.number,
        time: PropTypes.string,
        place: PropTypes.string,
        volume: PropTypes.string,
        marking: PropTypes.string,
        sample_container: PropTypes.string,
        method: PropTypes.object,
        type: PropTypes.object,
        preparation: PropTypes.string,
    }),
    onChange: PropTypes.func,
    methodOptions: PropTypes.array,
    typeOptions: PropTypes.array,
    onScanClicked: PropTypes.func
}

export default CourierAddSample
