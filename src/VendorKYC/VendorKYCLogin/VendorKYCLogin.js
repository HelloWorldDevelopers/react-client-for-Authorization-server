import React, { useContext, useEffect, useState } from 'react'
import logo from "../../CreateLink/rntlogo.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../CustomerFeedback/Assets/loader.json"
import Lottie from "lottie-react";
import ReactModal from "react-modal";
import { Url } from '../../Constants/APIUrlConstant';
import { useNavigate, useParams } from 'react-router-dom';
import { contextData } from '../../Context/MyContext';

const VendorKYCLogin = () => {
    const navigate = useNavigate();
    const { openModal } = useContext(contextData);
    const [showLoader, setShowLoader] = useState(false);
    const { id } = useParams();
    var decodedValue = atob(id);
    sessionStorage.setItem("ID", decodedValue)
    // localStorage.setItem('ID',decodedValue)
    const [getData, setGetData] = useState({
        contactName: '',
        contactPos: '',
        emailId: '',
        mobileNo: '',
        alternateNo: ''
    })
    const style1 = {
        width: "25%",
        margin: "0 auto",
    };

    useEffect(() => {
        setShowLoader(true)
        fetch(Url.getVendorFormData.replace("{id}", decodedValue), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setShowLoader(false)
                console.log('ddddddd', data)
                    setGetData({
                        contactName: data?.DATA?.leagalName,
                        tradeName: data?.DATA?.tradeName,
                        contactPos: data?.DATA?.contactName,
                        emailId: data?.DATA?.emailId,
                        mobileNo: data?.DATA?.mobileNo,
                    })
                    if (data?.DATA?.formFilled && atob(localStorage.getItem('isAdmin')) == 'admin') {
                        navigate(`/app/main/KYCForm/${decodedValue}`);
                        sessionStorage.setItem('renderStatus',true)
                    }
                    else if (data?.DATA?.formFilled && data?.DATA?.status === false && atob(localStorage.getItem('isAdmin')) !== 'admin') {
                        navigate(`/app/main/KYCForm/${decodedValue}`);
                    }
                    else if (data?.DATA?.status === true && atob(localStorage.getItem('isAdmin')) !== 'admin') {
                        navigate(`/app/SubmittedScreen`);
                    }
                    
               
            });
    }, [])

    const handleNavigate = () => {
        navigate(`/app/main/KYCForm/${decodedValue}`)
    }

    return (
        <div>
            <div className="Main_Div">
                <div className="Form_Container_Div1">
                    <div className="getStartedLogo_Div">
                        <img src={logo} alt='logo' />
                    </div>
                    <div className="Heading_Div">
                        <span className='mainHeadingData'>Vendor Onboarding</span>

                        <span style={{ fontWeight: 500, fontSize: "15px", width: "84%", margin: "0px auto", color: "rgb(131, 131, 131)" }}>
                            To ensure a seamless partnership, please take a moment to fill out our Vendor Onboarding Form.                        </span>
                    </div>
                    <div className="Input_Container_Div">
                        <div className="getStartedInner_Div">
                            <div className="getStartedInputs">
                                <div className="Input_Label">
                                    <label>Vendor Name</label>
                                    <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{getData.tradeName}</p>
                                </div>
                            </div>
                            <div className="getStartedInputs">
                                <div className="Input_Label">
                                    <label>SPOC</label>
                                </div>
                                <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{getData.contactPos}</p>
                            </div>
                            <div className="getStartedInputs">
                                <div className="Input_Label">
                                    <label>Email ID</label>
                                </div>
                                <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{getData.emailId}</p>
                            </div>
                            <div className="getStartedInputs">
                                <div className="Input_Label">
                                    <label>Mobile No</label>
                                </div>
                                <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{getData.mobileNo}</p>
                            </div>
                            <div className="getStartedButton_Container_Div">
                                <button
                                    onClick={handleNavigate}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer rtl />
                <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
                    overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
                    <Lottie animationData={Loader} style={style1} />
                </ReactModal>
            </div>
        </div>
    )
}

export default VendorKYCLogin