import { useState } from "react"
import DlBreadcrumb from "../Shared/Breadcrumb"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"

const PresentationCollapse = () => {
    
    const [currentIndex, setCurrentIndex] = useState(1)

    return (
        <PresentationSection title="Breadcrumbs">
            <PresentationSectionItem>
                <DlBreadcrumb
                    activeIndex={1}
                    items={[
                        { index: 1, title: "item 1" },
                        { index: 2, title: "item 2" },
                        { index: 3, title: "item 3" },
                    ]}
                />
            </PresentationSectionItem>
            <PresentationSectionItem>
                <DlBreadcrumb
                    currentIndex={currentIndex}
                    onChange={i => setCurrentIndex(i)}
                    items={[
                        { index: 1, title: "Заявки", path: '/' },
                        { index: 2, title: "item 2", href: "http://yandex.ru" },
                        { index: 3, title: "item 3" },
                    ]}
                />
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationCollapse
