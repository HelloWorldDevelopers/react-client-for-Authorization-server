import React from 'react';
import '../../src/EmployeeFeedback/EmployeeFieldData/EmployeeFieldData.css'
import Lottie from "lottie-react";
import cancel_btn from '../CustomerFeedback/Assets/cancel.svg'
import ReactModal from 'react-modal';
import Completed from '../CustomerFeedback/Assets/completed.json'
import failed from '../CustomerFeedback/Assets/failed.json'

import 'react-toastify/dist/ReactToastify.css';


function CommonEmplDownView({errorShow,setshowAddSuccessModal,showAddSuccessModal}) {

    const handleCloseAddSuccModal = () => {
        setshowAddSuccessModal(false);
    };

    const style = {
        width: "25%",
        margin: "0 auto",
    };



  return (
    <div>
       <ReactModal
                isOpen={showAddSuccessModal}
                contentLabel="Minimal Modal Example"
                className="Modal ModalHeightBug modalRes"
                overlayClassName="Overlay"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={false}
                onRequestClose={handleCloseAddSuccModal}
            >
                <div className="delete_close">
                    <img
                        src={cancel_btn}
                        alt="cancel-btn"
                        onClick={handleCloseAddSuccModal}
                        style={{width:"30px"}}
                    ></img>
                </div>
                <div className="HeroDiv MsgDiv">
                    {errorShow ?
                        <Lottie animationData={failed} style={style} /> :
                        <Lottie animationData={Completed} style={style} />
                    }
                    {errorShow ?
                        <span className="popupMsgSpan">Fill Required Details</span>
                        :
                        <span className="popupMsgSpan">Review Submitted Succesfully !</span>
                    }
                </div>
                <div className="buttonDivDele">
                    <button onClick={handleCloseAddSuccModal} className="DeleteClose">
                        OK
                    </button>
                </div>
            </ReactModal>
           
    </div>
  )
}

export default CommonEmplDownView
