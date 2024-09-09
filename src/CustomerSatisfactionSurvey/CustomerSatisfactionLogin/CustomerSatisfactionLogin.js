import React, { useEffect, useState } from 'react'
import './CustomerSatisfactionLogin.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../CustomerFeedback/Assets/loader.json"
import Lottie from "lottie-react";
import ReactModal from "react-modal";
import logo from "../../CreateLink/rntlogo.svg";
import { useNavigate, useParams } from 'react-router-dom';
import { Url } from '../../Constants/APIUrlConstant';

const CustomerSatisfactionLogin = () => {
  const { id } = useParams();
  const [isFilled, setIsFilled] = useState(true);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const navigate = useNavigate();
  var decodedValue = atob(id);
  sessionStorage.setItem("SatisfactionId", id);
  const handleName = (e) => {
    setName(e.target.value);
  };
  useEffect(() => {
    setShowLoader(true)
    fetch(
      Url.getCreateLinkLoginData.replace("{custSatisfactionId}", decodedValue),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((respone) => respone.json())
      .then((data) => {
        console.log("login data", data)
        setShowLoader(false)
        setIsFilled(data?.DATA?.filled);
        setName(data?.DATA?.addressMaster?.contactPersonName);
        setCompanyName(data?.DATA?.addressMaster.customer?.companyName);
        setEmailId(data?.DATA?.addressMaster?.contactPersonEmail);
        setMobileNo(data?.DATA?.addressMaster?.contactPersonNo||"-")
        if (data?.DATA?.filled == true && atob(localStorage.getItem('isAdmin')) == 'admin') {
          navigate(`/app/main/CSFilledFeedbackForm/${decodedValue}`);
        } else if (data?.DATA?.filled == true && atob(localStorage.getItem('isAdmin')) !== 'admin'){
          navigate(`/app/SubmittedScreen`);
          setIsFilled(false);
        }
      });
  }, []);

  const style1 = {
    width: "25%",
    margin: "0 auto",
  };

  const notify = () => {
    toast.dismiss();
    toast.error("Please enter only alphabets"); // Use toast.success for a success notification
  };

  const validate = () => {
    navigate('/app/main/CustomersatisfactionSurvey')
  };
  return (
    <div>
      <div className="CustomerSatisfLoginMain_Div">
        <div className="CustomerSatisfLoginForm_Container_Div1">
          <div className="CustomerSatisfLoginLogo_Div">
            <img src={logo} />
          </div>
          <div className="CustomerSatisfLoginHeading_Div">
            <span className='mainHeadingData'>Customer Satisfaction Survey</span>
            <span style={{ fontWeight: 500, fontSize: "14px", width: "84%", margin: "0px auto", color: "rgb(131, 131, 131)" }}>
            Your insights and opinions are valuable to us as we strive to improve and serve you better. Please take a moment to share your thoughts with us.
            </span>
          </div>
          <div className="CustomerSatisfLoginInput_Container_Div">
            <div className="CustomerSatisfLoginInner_Div">
              <div className="CustomerSatisfLoginInputs">
                <div className="CustomerSatisfLoginInput_Label">
                  <label>Company Name</label>
                </div>
                <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",color:"#615b5b"}}>{companyName}</p>

              </div>
              <div className="CustomerSatisfLoginInputs">
                <div className="CustomerSatisfLoginInput_Label">
                  <label>SPOC</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",color:"#615b5b"}}>{name}</p>

                </div>
              </div>
              <div className="CustomerSatisfLoginInputs">
                <div className="CustomerSatisfLoginInput_Label">
                  <label>Email ID</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",color:"#615b5b"}}>{emailId}</p>

                </div>
              </div>
              <div className="CustomerSatisfLoginInputs">
                <div className="CustomerSatisfLoginInput_Label">
                  <label>Mobile No</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",color:"#615b5b"}}>{mobileNo}</p>

                </div>
              </div>
              <div className="CustomerSatisfLoginButton_Container_Div">

                <button
                  onClick={() => {
                    validate();
                  }}
                >
                  Start Feedback
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

export default CustomerSatisfactionLogin