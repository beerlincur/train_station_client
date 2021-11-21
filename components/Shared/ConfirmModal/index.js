import PropTypes from 'prop-types'
import DlModal from '../Modal'

const ConfirmModal = props => {
    
    const closeModal = () => {
        if (typeof props.onClose === "function") {
            props.onClose()
        }
    }

    return (
        <DlModal
            visible={props.visible}
            onSave={props.onPositive}
            onCancel={props.onNegative}
            saving={props.saving}
            title={props.title}
            onRequestClose={closeModal}
            saveType={props.saveType || "error"}
            saveText={props.saveText || "Да, удалить"}
            cancelText="Отменить"
            contentStyle={props.contentStyle || { top: "15vh" }}
        >
            {props.children}
        </DlModal>
    )
}

ConfirmModal.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    saveType: PropTypes.string,
    saveText: PropTypes.string,
    onClose: PropTypes.func,
    onPositive: PropTypes.func,
    onNegative: PropTypes.func,
}

export default ConfirmModal
