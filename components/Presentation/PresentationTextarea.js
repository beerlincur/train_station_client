import { useState } from "react"
import DlTextarea from "../Shared/Textarea"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationInput = () => {
    const [inputVal, setInputVal] = useState("")
    const [inputVal2, setInputVal2] = useState("There once was a dog. The dog had a friend. The dog's friend was a cat.")
    const [inputVal3, setInputVal3] = useState("disabled textarea")
    return (
        <PresentationSection title="Textarea">
            <PresentationSectionItem dark>
                <DlTextarea
                    dark
                    placeholder="Textarea on dark theme..."
                    value={inputVal}
                    onChange={ev => setInputVal(ev.target.value)}
                />
            </PresentationSectionItem>
            <PresentationSectionItem>
                <DlTextarea
                    value={inputVal2}
                    placeholder="Textarea on light theme..."
                    onChange={ev => setInputVal2(ev.target.value)}
                />
            </PresentationSectionItem>
            <PresentationSectionItem>
                <DlTextarea
                    value={inputVal3}
                    onChange={ev => setInputVal3(ev.target.value)}
                    disabled={true}
                />
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationInput
