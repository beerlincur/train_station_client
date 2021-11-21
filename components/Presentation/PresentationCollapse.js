import DlCollapse from "../Shared/Collapse"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationCollapse = () => {
    return (
        <PresentationSection title="Collapse">
            <PresentationSectionItem>
                <DlCollapse title="Collapse title">
                    <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum, adipisci.</div>
                    <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum, adipisci.</div>
                    <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum, adipisci.</div>
                    <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum, adipisci.</div>
                    <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum, adipisci.</div>
                </DlCollapse>
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationCollapse
