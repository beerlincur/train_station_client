import DlSelect from "../Shared/Select"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationSelect = () => {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    return (
        <PresentationSection title="Select">
            <PresentationSectionItem>
                <DlSelect options={options} />
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationSelect
