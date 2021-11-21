import { useState } from "react"
import DlInput from "../Shared/Input"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
const st = {}

const PresentationInput = () => {
  const [inputVal, setInputVal] = useState("")
  const [inputVal2, setInputVal2] = useState("")
  const [inputVal3, setInputVal3] = useState("disabled input")
  return (
    <PresentationSection title="Inputs">
      <PresentationSectionItem dark>
        <DlInput
          dark
          placeholder="input on dark theme..."
          value={inputVal}
          onChange={ev => setInputVal(ev.target.value)}
          error="This is a dark error"
          />
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlInput
          value={inputVal2}
          placeholder="input on light theme..."
          onChange={ev => setInputVal2(ev.target.value)}
          error="This is a light error"
        />
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlInput
          value={inputVal3}
          onChange={ev => setInputVal3(ev.target.value)}
          disabled={true}
        />
      </PresentationSectionItem>
    </PresentationSection>
  )
}

export default PresentationInput
