import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import logo from "../rntlogo (2).svg";
import userIcon from "../Assets/UserIcon.png";
import { useLocation } from "react-router-dom";

const Header = ({ show, hideText }) => {
  const path = useLocation().pathname;
  const [logoutBtnOpen, setLogoutBtnOpen] = useState(false);
  const [fullName, setFullName] = useState(atob(sessionStorage?.getItem('loginName')))
  const [projectName, setProjectName] = useState(sessionStorage.getItem('projectName'))
  const [name, setname] = useState("")
  const [logouttoggle, setlogouttoggle] = useState(false)
  const [satificationID, setSatificationID] = useState('')
  const [custFeedbackId, setCustFeedbackId] = useState('');
  const [employeID, setEmployeID] = useState('');


  const [customerID, setCustomerID] = useState('')
  const logoutRef = useRef();

  const logOutBtn = (event) => {
    event.stopPropagation();
    setLogoutBtnOpen(!logoutBtnOpen);
  };
  useEffect(() => {
    const ID = sessionStorage.getItem('customerId');
    setCustomerID(ID)
  }, [customerID])

  useEffect(() => {
    const empID = sessionStorage.getItem('employeeID')
    setEmployeID(empID)
  }, [employeID])




  useEffect(() => {
    const custID = sessionStorage.getItem('custFeedbackId');
    setCustFeedbackId(custID)
  }, [])

  useEffect(() => {
    const satificationID = sessionStorage.getItem('SatisfactionId')
    setSatificationID(satificationID)
  }, [satificationID])

  const Togglelogout = () => {
    // setlogouttoggle(logouttoggle)
  }

  useEffect(() => {
    setTimeout(() => {
      const empName = sessionStorage.getItem('name');
      setname(empName)
    }, 500)
  }, [])


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setLogoutBtnOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  let headerName = "";
  if (path.includes('CSFilledFeedbackForm') ||path == '/app/main/CSFilledFeedbackForm/TVRJNA==' || path == '/app/main/CSDownloadView' || path == '/app/main/CSFilledFeedbackForm/MTI4' || path == '/app/main/CustomersatisfactionSurvey' || path == `/app/main/CSFilledFeedbackForm/${satificationID}`) {
    headerName = "Customer Satisfaction Survey";
  }
  else if (path == `/app/main/FilledFeedbackForm/${customerID}` || path == "/app/main/CustomerNext" || path == "/app/main/FeedbackForm" || path.includes('FilledFeedbackForm') || path == '/app/main/FilledFeedbackForm/TWpNNQ==') {
    headerName = "Project End Feedback For " + projectName;
  }
  else if (path == "/app/main/EmployeeForm" ||
    path == "/app/main/EmployeeDownloadView" ||
    path == '/app/main/EmployeeFilledFeedback/TlRVPQ==' ||
    path == "/app/main/EmployeeFilledFeedback/55" ||
    path == '/app/main/EmployeeFilledFeedback/54' ||
    path.includes('EmployeeFilledFeedback')) {
    headerName = "Employee Feedback For " + sessionStorage.getItem('empName');
  }
  else if (path == '/app/main/KYCForm') {
    headerName = "Vendor Onboarding";
  }



  return (
    <div className={show == true || !hideText ? 'mainHeaderSection1' : 'mainHeaderSection'}>
      <div className="HeaderlogoDiv">
        <img src={logo} alt="rntLogo" className={show == true ? 'HeaderlogoDiv1' : 'HeaderlogoDiv2'} />
      </div>
      <div className={show == true || !hideText ? 'hideUser' : 'HeadertextDiv'}>{headerName}</div>
      <div className="HeaderNotification">

        <div className="HeaderuserDiv" >
          {logouttoggle &&
            <>
              <button onClick={logOutBtn}>Logout</button>



              <div className="logoutUserImg">
                <img className={show == true || !hideText ? 'hideUser' : 'userImg'} src={userIcon} alt="" />
              </div>
              <div className={show == true || !hideText ? 'hideUser' : 'userName'}>
                <span>{fullName}</span>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
