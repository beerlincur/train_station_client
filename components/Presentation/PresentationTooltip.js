import DlTooltip from "../Shared/Tooltip"
import DlIcon from "../Shared/Icon"
import DlButton from "../Shared/Button"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationTooltip = () => {


    return (
        <PresentationSection title="Tooltip">
            <PresentationSectionItem>
                <div style={{ marginLeft: "400px"}}>
                    <DlTooltip content="This is a tooltip, position: top" position="top">
                        <DlIcon name="help" box={16} />
                    </DlTooltip>
                </div>
            </PresentationSectionItem>
            <PresentationSectionItem>
                <div style={{ marginLeft: "400px"}}>
                    <DlTooltip content="This is a tooltip, position: bottom" position="bottom">
                        <DlButton type="info">
                            <span>Click me</span>
                        </DlButton>
                    </DlTooltip>
                </div>
            </PresentationSectionItem>
            <PresentationSectionItem>
                <div style={{ marginLeft: "400px"}}>
                    <DlTooltip content="This is a tooltip, position: right" position="right">
                        <DlButton type="error">
                            <DlIcon name="help" box={16} />
                        </DlButton>
                    </DlTooltip>
                </div>
            </PresentationSectionItem>
            <PresentationSectionItem>
                <div style={{ marginLeft: "400px"}}>
                    <DlTooltip content="This is a tooltip, position: left" position="left">
                        <DlButton type="success">
                            <DlIcon name="done" />
                            <span>Click me</span>
                        </DlButton>
                    </DlTooltip>
                </div>
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationTooltip
