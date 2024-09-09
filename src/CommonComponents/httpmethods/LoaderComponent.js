import React from 'react'
import ReactModal from 'react-modal'
import Lottie from "lottie-react";
import Loader from "../../../src/CustomerFeedback/Assets/loader.json"

// import { Loaderstyle } from '../../Constants/ConstantsFunctionStyle';
// import Loader from "../../Assets/lottie/loader.json"
 
const LoaderComponent = ({showLoader}) => {
    const style = {
        width: "25%",
        margin: "0 auto",
      };
  return (
    <div>
      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style} />
      </ReactModal>
    </div>
  )
}

export default LoaderComponent
