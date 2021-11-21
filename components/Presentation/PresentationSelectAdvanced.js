import DlSelectAdvanced from "../Shared/SelectAdvanced"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
import DlFormItem from '../Shared/FormItem/FormItem'
import { useState } from "react"

const options = [
    { value: 'chocolate', label: 'Chocolate 1' },
    { value: 'chocolate2', label: 'Chocolate 2' },
    { value: 'chocolate3', label: 'Chocolate 3' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const PresentationSelectAdvanced = () => {

    const [value1, setValue1] = useState("")
    const [value2, setValue2] = useState("")
    const [value3] = useState("")
    const [selected1, setSelected1] = useState(null)
    const [selected2, setSelected2] = useState(null)
    const [selected3] = useState(null)

    const handleChange1 = value => {
        setValue1(value1)
    }

    const handleSelect1 = item => {
        setSelected1(item)
        setSelected2(null)
    }

    return (
        <PresentationSection title="Select advanced">
            <PresentationSectionItem>
                <DlSelectAdvanced
                    options={options}
                    inputId={`input-123`}
                    inputValue={value1}
                    value={selected1}
                    onInputChange={handleChange1}
                    onSelect={handleSelect1}
                    emptyMessage="Нет совпадений!"
                    isClearable
                />
            </PresentationSectionItem>
            <PresentationSectionItem>
                <DlFormItem label="Select advanced label:">
                    <DlSelectAdvanced
                        placeholder="Выберите из списка..."
                        options={options}
                        inputId={`input-124`}
                        value={selected2}
                        onInputChange={val => setValue2(val)}
                        onSelect={(item) => setSelected2(item)}
                        isClearable
                    />
                </DlFormItem>
            </PresentationSectionItem>
            <PresentationSectionItem>
                <DlFormItem label="Select advanced disabled:">
                    <DlSelectAdvanced
                        placeholder="Выберите..."
                        options={options}
                        inputId={`input-125`}
                        value={selected3}
                        onSelect={(item) => setSelected2(item)}
                        isDisabled
                    />
                </DlFormItem>
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationSelectAdvanced
