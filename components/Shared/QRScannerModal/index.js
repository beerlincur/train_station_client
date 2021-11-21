import st from "./QRScannerModal.module.css";
import DlButton from "../Button";
import DlIcon from "../Icon";
import ReactModal from "react-modal";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import cx from "classnames";
import DlTag from "../Tag";


const facingModeType = {
    user: 'user',
    environment: 'environment'
}

const QRScannerModal = props => {
    const modalBody = useRef(null)
    const loadingRef = useRef(null)
    const canvasRef = useRef(null)
    const outputRef = useRef(null)
    const outputMessageRef = useRef(null)
    const outputDataRef = useRef(null)
    const animationIdRef = useRef(null)
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const {
        visible,
        title,
        footer:
        FooterComp,
        saveText = "Готово",
        cancelText = "Отмена",
        saveType = "success",
        saving,
        cancelling,
        ...rest
    } = props;

    const [show, setShow] = useState(false)
    const [facingModeInside, setFacingModeInside] = useState(facingModeType.environment)
    const [multiCameras, setMultiCameras] = useState(false)

    useEffect(() => {
        setShow(visible)
        if (visible) {
            getVideoStream()
            setNumberOfCameras()
        }
    }, [visible, facingModeInside])

    const setNumberOfCameras = async () => {
        if (!navigator && !navigator.mediaDevices) return
        const response = await navigator.mediaDevices.enumerateDevices({ kind: 'videoinput' });
        if (response.filter(i => i.kind === 'videoinput').length > 1) {
            setMultiCameras(true)
        }
    }

    const getVideoStream = async () => {
        if (navigator && navigator.mediaDevices) {
            streamRef.current = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: facingModeInside
                }
            })
            if (!videoRef.current) {
                videoRef.current = document.createElement("video")
            }
            const video = videoRef.current
            const stream = streamRef.current
            video.srcObject = stream;
            video.setAttribute("playsinline", false);
            video.setAttribute("webkit-playsinline", false);
            video.play();
            animationIdRef.current = requestAnimationFrame(tick)
        }
    }

    const drawLine = (begin, end, color) => {
        const canvasElement = canvasRef.current
        const canvas = canvasElement.getContext("2d")
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    const tick = () => {
        const video = videoRef.current
        const loadingMessage = loadingRef.current
        const canvasElement = canvasRef.current
        const outputContainer = outputRef.current
        const outputMessage = outputMessageRef.current
        const outputData = outputDataRef.current
        const modalBodyEl = modalBody.current
        
        if (loadingMessage && canvasElement) {
            const canvas = canvasElement.getContext("2d")
            loadingMessage.innerText = "⌛ Видео загружается..."
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                loadingMessage.hidden = true;
                canvasElement.hidden = false;
                outputContainer.hidden = false;

                // responsive video
                const currentVideoAspectRatio = (video.videoWidth || 0) / (video.videoHeight || 1)
                canvasElement.width = modalBodyEl.offsetWidth;
                canvasElement.height = modalBodyEl.offsetWidth / currentVideoAspectRatio;

                canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
                const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                    drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                    drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                    drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                    outputMessage.hidden = true;
                    outputData.parentElement.hidden = false;
                    if (code.data) {
                        outputData.innerText = code.data;
                        handleScan(code.data)
                        return handleClose()
                    }
                } else {
                    outputMessage.hidden = false;
                    outputData.parentElement.hidden = true;
                }
            }
        }
        animationIdRef.current = requestAnimationFrame(tick)
    }

    const stopVideoStream = () => {
        const animationId = animationIdRef.current
        if (animationId) {
            cancelAnimationFrame(animationId)
        }
        const stream = streamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    const handleClose = () => {
        setShow(false)
        // stop Video Stream and cancel animations
        stopVideoStream()
        if (typeof props.onRequestClose === "function") {
            props.onRequestClose()
        }
    }

    const handleScan = (data) => {
        if (typeof props.onScan === "function") {
            props.onScan(data)
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
            <div className={st.heading}>
                {title && <h1 className={st.title}>{title}</h1>}
                <div className={st.close}>
                    <DlButton icon circle size="xs" onClick={handleClose}>
                        <DlIcon name="close" />
                    </DlButton>
                </div>
            </div>
            <div className={st.body} ref={modalBody}>
                {/* // todo get permission */}
                <div ref={loadingRef}>🎥 Нет доступа к камере (убедитесь, что у Вашего устройства есть камера)</div>
                <canvas ref={canvasRef} hidden/>
                <div ref={outputRef} hidden>
                    <div ref={outputMessageRef}>QR-код не распознан.</div>
                    <div hidden><b>Data:</b> <span ref={outputDataRef}/></div>
                </div>
                {multiCameras &&
                    <div className={cx(st.samples_container, st.no_space_between)}>
                        <DlTag
                            type={facingModeInside === facingModeType.environment ? "info" : "default"}
                            onClick={() => setFacingModeInside(facingModeType.environment)}>Задняя камера</DlTag>
                        <DlTag
                            type={facingModeInside === facingModeType.user ? "info" : "default"}
                            onClick={() => setFacingModeInside(facingModeType.user)}>Фронтальная камера</DlTag>
                    </div>
                }
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
                                onClick={handleClose}
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
        </ReactModal>
    )
}

QRScannerModal.propTypes = {
    visible: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    onAfterOpen: PropTypes.func,
    onAfterClose: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.func,
    footer: PropTypes.func,
    onScan: PropTypes.func,
    saving: PropTypes.bool,
    onCancel: PropTypes.func,
    cancelling: PropTypes.bool,
    contentLabel: PropTypes.string,
    id: PropTypes.string,
    saveText: PropTypes.string,
    cancelText: PropTypes.string,
    saveType: PropTypes.string,
}

export default QRScannerModal