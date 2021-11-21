import { useState } from "react"
import DlFormItem from "../Shared/FormItem/FormItem"
import DlInput from "../Shared/Input"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
import st from "./PresentationSection.module.css"

const PresentationFormItem = () => {
  const [inputVal, setInputVal] = useState("")
  const [inputVal2, setInputVal2] = useState("")
  return (
    <PresentationSection title="FormItems">
      <PresentationSectionItem dark>
        <DlFormItem label="Dark form item:" dark>
          <DlInput
            dark
            placeholder="form item on Dark theme..."
            value={inputVal}
            onChange={ev => setInputVal(ev.target.value)}
          />
        </DlFormItem>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlFormItem label="Form item:">
          <DlInput
            placeholder="Form item on light theme..."
            value={inputVal2}
            onChange={ev => setInputVal2(ev.target.value)}
          />
        </DlFormItem>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlFormItem multiple label="Form item (multiple):">
          <DlInput
            placeholder="Form item 1..."
            wrapperClass={st.input}
            value={inputVal}
            onChange={ev => setInputVal(ev.target.value)}
            />
          <DlInput
            placeholder="Form item 2..."
            disabled
            wrapperClass={st.input}
            value={inputVal2}
            onChange={ev => setInputVal2(ev.target.value)}
            />
          <DlInput
            placeholder="Form item 3..."
            wrapperClass={st.input}
            value={inputVal}
            onChange={ev => setInputVal(ev.target.value)}
          />
        </DlFormItem>
      </PresentationSectionItem>
    </PresentationSection>
  )
}

export default PresentationFormItem
