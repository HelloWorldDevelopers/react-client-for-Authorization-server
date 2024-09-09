import React from 'react'
import cancel_btn from '../CustomerFeedback/Assets/cancel.svg'
import ReactModal from 'react-modal';
import failed from '../CustomerFeedback/Assets/failed.json'
import Lottie from "lottie-react";

const ValidateModal = ({ onRequestClose, isOpen, selectedFieldsWithLabels, selectedCheckboxes }) => {
    const style = {
        width: "25%",
        margin: "0 auto",
    };

    let message = null;

    if (Object.keys(selectedFieldsWithLabels)?.length === 0 && selectedCheckboxes?.length === 0) {
        message = <span className="popupMsgSpan">Please Select Primary Information and Prompt</span>;
    } else if (Object.keys(selectedFieldsWithLabels)?.length === 0) {
        message = <span className="popupMsgSpan">Please Select Primary Information</span>;
    } else if (selectedCheckboxes?.length === 0) {
        message = <span className="popupMsgSpan">Please Select Question</span>;
    }
    return (
        <ReactModal
            isOpen={isOpen}
            contentLabel="Minimal Modal Example"
            className="Modal ModalHeightBug modalRes"
            overlayClassName="Overlay"
            ariaHideApp={false}
            shouldCloseOnOverlayClick={false}
            onRequestClose={onRequestClose}
        >
            <div className="delete_close">
                <img
                    src={cancel_btn}
                    alt="cancel-btn"
                    onClick={onRequestClose}
                    style={{width:"30px"}}
                ></img>
            </div>
            <div className="HeroDiv MsgDiv" style={{ position: 'relative' }}>
                <Lottie animationData={failed} style={style} />
                {message}
            </div>
            <div className="buttonDivDele">
                <button onClick={onRequestClose} className="DeleteClose">
                    OK
                </button>
            </div>
        </ReactModal>
    )
}

export default ValidateModal