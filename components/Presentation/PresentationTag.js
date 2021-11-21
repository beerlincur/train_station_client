import DlTag from "../Shared/Tag"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationTag = () => {
  
  const onTagClick = () => {
  }

  const onDeleteTag = () => {
  }

  return (
    <PresentationSection title="Tags">
      <PresentationSectionItem>
        <DlTag type="primary">primary</DlTag>
        <DlTag type="success" onClick={onTagClick}>success</DlTag>
        <DlTag type="info" onDelete={onDeleteTag}>info</DlTag>
        <DlTag type="warning">warning</DlTag>
        <DlTag type="error">error</DlTag>
        <DlTag type="default">Вызвать курьера</DlTag>
      </PresentationSectionItem>
      <PresentationSectionItem>
        <DlTag size="sm" type="primary">primary</DlTag>
        <DlTag size="sm" dark type="success">success</DlTag>
        <DlTag size="xs" type="info">info</DlTag>
        <DlTag size="xs" type="warning" dark>В лаборатории</DlTag>
        <DlTag size="xs" type="error">error</DlTag>
        <DlTag size="xs" type="default">Вызвать курьера</DlTag>
      </PresentationSectionItem>
    </PresentationSection>
  )
}

export default PresentationTag
