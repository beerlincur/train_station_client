import DlButton from "../Shared/Button"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
import { useState } from "react"
import DlModal from "../Shared/Modal"
import DomNotification from "../Shared/DomNotification"

const PresentationTag = () => {

    const [showModal, setShowModal] = useState(false)

    const handleSave = () => DomNotification.success("Сохранить")

    return (
        <PresentationSection title="Modal">
            <PresentationSectionItem>
                <DlButton type="primary" onClick={() => setShowModal(true)}>Modal</DlButton>
                <DlModal
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                    onCancel={() => setShowModal(false)}
                    onSave={handleSave}
                    title="Добавить пробу"
                >
                    this is the content
                </DlModal>
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationTag
