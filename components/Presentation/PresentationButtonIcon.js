import DlButton from "../Shared/Button"
import DlIcon from "../Shared/Icon"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationButtonIcon = () => {
  return (
    <PresentationSection title="Buttons with Icons">
      <PresentationSectionItem>
        <DlButton type="primary">
          <DlIcon name="notification" />
          <span>Добавить еще пробу</span>
        </DlButton>
        <DlButton type="success"> <DlIcon name="done" /> Success</DlButton>
        <DlButton type="error"> <DlIcon name="delete" /> Error</DlButton>
        <DlButton type="text"> <DlIcon name="delete" /> Text</DlButton>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlButton icon size="sm" type="primary">
          <DlIcon name="delete" />
        </DlButton>
        <DlButton icon size="sm" type="info">
          <DlIcon name="close" />
        </DlButton>
        <DlButton icon size="sm" type="success">
          <DlIcon name="error" />
        </DlButton>
        <DlButton icon size="sm" type="text">
          <DlIcon name="error" />
        </DlButton>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlButton icon circle size="sm" type="primary">
          <DlIcon name="delete" />
        </DlButton>
        <DlButton icon circle size="sm" type="info">
          <DlIcon name="close" />
        </DlButton>
        <DlButton icon circle size="sm" type="success">
          <DlIcon name="error" />
        </DlButton>
      </PresentationSectionItem>
    </PresentationSection>
  )
}

export default PresentationButtonIcon
