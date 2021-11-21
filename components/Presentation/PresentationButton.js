import DlButton from "../Shared/Button"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationButton = () => {
  return (
    <PresentationSection title="Buttons">
      <PresentationSectionItem>
        <DlButton type="primary">Добавить еще пробу</DlButton>
        <DlButton type="info">Info</DlButton>
        <DlButton type="success">Разместить заявку</DlButton>
        <DlButton type="warning">warning</DlButton>
        <DlButton type="error">Error</DlButton>
        <DlButton type="text">Text</DlButton>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlButton size="sm" type="primary">Добавить еще пробу</DlButton>
        <DlButton size="sm" type="info">Info</DlButton>
        <DlButton size="sm" type="success">Разместить заявку</DlButton>
        <DlButton size="sm" type="warning">warning</DlButton>
        <DlButton size="sm" type="error">Error</DlButton>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlButton size="xs" type="primary">Добавить еще пробу</DlButton>
        <DlButton size="xs" type="info">Info</DlButton>
        <DlButton size="xs" type="success">Разместить заявку</DlButton>
        <DlButton size="xs" type="warning">warning</DlButton>
        <DlButton size="xs" type="error">Error</DlButton>
      </PresentationSectionItem>
    </PresentationSection>
  )
}

export default PresentationButton
