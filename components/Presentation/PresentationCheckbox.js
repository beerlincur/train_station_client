import { useState } from "react"
import DlCheckbox from "../Shared/Checkbox"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationCollapse = () => {
    
    const [checkboxVal, setCheckboxVal] = useState(false)
    const [checkboxVal2, setCheckboxVal2] = useState(true)

    return (
        <PresentationSection title="Checkbox">
            <PresentationSectionItem>
                <DlCheckbox value={checkboxVal} onChange={val => setCheckboxVal(val)} label="unchecked checkbox" />
            </PresentationSectionItem>
            <PresentationSectionItem>
                <DlCheckbox value={checkboxVal2} onChange={val => setCheckboxVal2(val)} label="checked checkbox" />
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationCollapse
