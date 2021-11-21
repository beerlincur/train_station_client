import DlIcon from "../Shared/Icon"
import PresentationSection, { PresentationSectionItem } from "./PresentationSection"
import st from "./PresentationSection.module.css"
import cx from 'classnames'
import ICONS_NAMES from "../../utils/icon-names.json"
import DomNotification from "../Shared/DomNotification"


const PresentationIcon = () => {
    const handleClick = (iconName) => {
        const textToCopy = `<DlIcon name="${iconName}" />`
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                DomNotification.success({ title: "Copied to clipboard", duration: 5000 })
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
    return (
        <PresentationSection title="Icons">
            <PresentationSectionItem>
                <div className={cx(st.flex, st.wrap)}>
                    {ICONS_NAMES.map((icon, i) => (
                        <div className={st.flexItem} key={i} title={icon} style={{ cursor: 'pointer' }} onClick={() => handleClick(icon)}>
                            <DlIcon name={icon} color="primary" />
                        </div>
                    ))}
                </div>
            </PresentationSectionItem>
        </PresentationSection>
    )
}

export default PresentationIcon
