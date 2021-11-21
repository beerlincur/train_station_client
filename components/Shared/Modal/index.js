import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import DlButton from '../Button'
import DlIcon from '../Icon'
import st from './Modal.module.css'

const DlModal = props => {

    const {
        visible,
        title,
        footer:
        FooterComp,
        saveText = "Сохранить",
        cancelText = "Отмена",
        saveType = "success",
        saving,
        cancelling,
        contentStyle,
        ...rest
    } = props;

    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(visible)
    }, [visible])

    const handleClose = () => {
        setShow(false)
        if (typeof props.onRequestClose === "function") {
            props.onRequestClose()
        }
    }

    const handleSave = () => {
        if (typeof props.onSave === "function") {
            props.onSave()
        }
    }

    const handleCancel = () => {
        if (typeof props.onCancel === "function") {
            props.onCancel()
        } else {
            handleClose()
        }
    }

    return (
        <ReactModal
            isOpen={show}
            className={st.modal}
            overlayClassName={st.overlay}
            bodyOpenClassName="modal-open"
            shouldCloseOnOverlayClick
            onRequestClose={handleClose}
            ariaHideApp={false}
            {...rest}
        >
            <div className={st.content} style={contentStyle}>
                <div className={st.heading}>
                    {title && <h1 className={st.title}>{title}</h1>}
                    <div className={st.close}>
                        <DlButton icon circle size="xs" onClick={handleClose}>
                            <DlIcon name="close" />
                        </DlButton>
                    </div>
                </div>
                <div className={st.body}>
                    {props.children}
                </div>
                <div className={st.footer}>
                    {!!FooterComp ?
                        <FooterComp />
                        :
                        <div className={st.actions}>
                            <div className={st.actionBtn}>
                                <DlButton
                                    type={saveType}
                                    size="sm"
                                    onClick={handleSave}
                                    loading={saving}
                                    >
                                    {saveText}
                                </DlButton>
                            </div>
                            <div className={st.actionBtn}>
                                <DlButton
                                    outlined
                                    color="#969696"
                                    bgColor="transparent"
                                    size="sm"
                                    onClick={handleCancel}
                                    loading={cancelling}
                                >
                                    {cancelText}
                                </DlButton>
                            </div>
                        </div>
                    }
            </div>
            </div>
        </ReactModal>
    )
}

DlModal.propTypes = {
    visible: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    onAfterOpen: PropTypes.func,
    onAfterClose: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.func,
    footer: PropTypes.func,
    onSave: PropTypes.func,
    saving: PropTypes.bool,
    onCancel: PropTypes.func,
    cancelling: PropTypes.bool,
    contentLabel: PropTypes.string,
    id: PropTypes.string,
    saveText: PropTypes.string,
    cancelText: PropTypes.string,
    saveType: PropTypes.string,
}

export default DlModal
