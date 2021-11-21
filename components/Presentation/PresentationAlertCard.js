import AlertCard from "../Shared/AlertCard"
import AlertCardTitle from "../Shared/AlertCardTitle"
import AlertCardSupertitle from "../Shared/AlertCardSupertitle"
import AlertCardSubtitle from "../Shared/AlertCardSubtitle"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
import DomNotification from '../Shared/DomNotification';

const PresentationTag = () => {

    const handleIconClick = (type1) => {
        let type = type1
        if (!['success', 'warning', 'info', 'error'].includes(type)) {
            type = 'success'
        }
        DomNotification({ type, title: `Alert card type: ${type}`})
    }

    return (
        <PresentationSection title="Alert Card">
            <PresentationSectionItem styles={{maxWidth: '300px'}}>
                <AlertCard type="primary" onIconClick={() => handleIconClick("primary")}>
                    <AlertCardSubtitle>primary subtitle</AlertCardSubtitle>
                    <AlertCardTitle>primary title</AlertCardTitle>
                </AlertCard>
            </PresentationSectionItem>
            <PresentationSectionItem styles={{maxWidth: '300px'}}>
                <AlertCard type="success" onIconClick={() => handleIconClick("success")}>success</AlertCard>
            </PresentationSectionItem>
            <PresentationSectionItem styles={{maxWidth: '300px'}}>
                <AlertCard type="info">
                    <AlertCardSubtitle>Отбор проб:</AlertCardSubtitle>
                    <AlertCardSupertitle>Забрать пробу</AlertCardSupertitle>
                </AlertCard>
            </PresentationSectionItem>
            <PresentationSectionItem styles={{maxWidth: '300px'}}>
                <AlertCard type="warning" onIconClick={() => handleIconClick("warning")}>
                    <AlertCardSubtitle>Тип оплаты:</AlertCardSubtitle>
                    <AlertCardTitle>Наличные</AlertCardTitle>
                    <AlertCardSupertitle>3 415, <small>41</small> ₽</AlertCardSupertitle>
                </AlertCard>
            </PresentationSectionItem>
            <PresentationSectionItem styles={{maxWidth: '300px'}}>
                <AlertCard type="error" onIconClick={() => handleIconClick("error")}>error</AlertCard>
            </PresentationSectionItem >
        </PresentationSection>
    )
}

export default PresentationTag
