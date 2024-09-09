import React from 'react'
import "./EmployeeLogin.css";
import { useEffect, useState } from "react";
import { Url } from "../../Constants/APIUrlConstant";
import logo from "../../CreateLink/rntlogo.svg";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../CustomerFeedback/Assets/loader.json"
import Lottie from "lottie-react";
import ReactModal from "react-modal";


const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState('');
  const [ProjectManager, setProjectManager] = useState('');
  const [email, setemailId] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [isFilled, setIsFilled] = useState(true);
  const { id } = useParams();
  var decodedValue = atob(id);
  sessionStorage.setItem("employeeID", id);
  const style1 = {
    width: "25%",
    margin: "0 auto",
  };

  useEffect(() => {
    setShowLoader(true)
    fetch(
      Url.getEmployeeDetailsById.replace("{id}", decodedValue),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((respone) => respone.json())
      .then((data) => {
        console.log("Employee Login Details api", data)
        setShowLoader(false)
        setIsFilled(data?.DATA?.filled);
        setName(data?.DATA?.employeeMaster.fullName);
        setProjectName(data?.DATA?.project?.projectName);
        setProjectManager(data?.DATA?.projectManagerName);
        setemailId(data?.DATA?.projectManagerEmail);
        sessionStorage.setItem("empName",data?.DATA?.employeeMaster.fullName)
        if (data?.DATA?.filled == true && atob(localStorage.getItem('isAdmin')) == 'admin') {
          navigate(`/app/main/EmployeeFilledFeedback/${decodedValue}`);
        } else if (data?.DATA?.filled == true && atob(localStorage.getItem('isAdmin')) !== 'admin'){
          navigate(`/app/SubmittedScreen`);
          setIsFilled(false);
        }
      });
  }, []);
 

  const validate = () => {
    navigate('/app/main/EmployeeForm')
  };

  return (
    <>
      <div className="Main_Div">
        <div className="Form_Container_Div1">
          <div className="getStartedLogo_Div">
            <img src={logo} />
          </div>
          <div className="Heading_Div">
            <span className="mainHeadingData" data-testid="mysle">
              Employee Feedback For {name}
            </span>
            <span style={{ fontWeight: 500, fontSize: '14px', width: '84%', margin: '0 auto', color: ' #838383' }}>
            Your satisfaction is our top priority, and we continuously strive to enhance our services. To upskill our employees and serve you better, we ask for your feedback on the performance of {name}.        </span>
          </div>
          <div className="Input_Container_Div">
            <div className="getStartedInner_Div">
              <div className="getStartedInputs">
                <div className="loginInput_Label">
                  <label>Project Manager</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",margin:'2px 0',color:"#615b5b"}}>{ProjectManager}</p>

                </div>
              </div>
              <div className="getStartedInputs">
                <div className="loginInput_Label">
                  <label>Email</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",margin:'2px 0',color:"#615b5b"}}>{email}</p>

                </div>

              </div>
              <div className="getStartedInputs">
                <div className="loginInput_Label">
                  <label>Employee Name</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",margin:'2px 0',color:"#615b5b"}}>{name}</p>

                </div>

              </div>
              <div className="getStartedInputs">
                <div className="loginInput_Label">
                  <label>Project Name</label>
                  <p style={{fontSize:"13px",backgroundColor:"#98949433",width:"100%",padding:"8px",margin:'2px 0',color:"#615b5b"}}>{projectName}</p>

                </div>

              </div>
              <div className="getStartedButton_Container_Div">
                <button onClick={() => {
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
    </>
  )
}

export default EmployeeLogin