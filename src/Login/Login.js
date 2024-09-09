import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useEffect, useState } from "react";
import { Url } from "../Constants/APIUrlConstant";
import logo from "./rntlogo.svg";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../src/CustomerFeedback/Assets/loader.json"
import Lottie from "lottie-react";
import ReactModal from "react-modal";
import { PUTWithoutToken } from './../CommonComponents/httpmethods/httpMethods';



function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const { id } = useParams();
  const [isFilled, setIsFilled] = useState(true);
  sessionStorage.setItem("customerId", id);
  const [projectId, setProjectId] = useState("");

  const handleName = (e) => {
    setName(e.target.value);
  };
  const style1 = {
    width: "25%",
    margin: "0 auto",
  };

  const handleCompanyName = (e) => {
    setCompanyName(e.target.value);
  };
  const handleProjectName = (e) => {
    setProjectName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmailId(e.target.value)
  }

  const token = sessionStorage.getItem('token')

  const handleRole = (e) => {
    let trimmedValue = e.target.value?.trim();
    let pattern = /^[a-zA-Z\s.,']+$/;

    if (!pattern.test(trimmedValue) && trimmedValue !== "") {
      if (e.target.value?.includes('  ')) {
        setRole(e.target.value?.replace(/\s+/g, ' '));
      } else {
        // notify();
      }
    } else {
      if (trimmedValue === "") {
        setRole("");
      } else {
        if (e.target.value.includes('  ')) {
          setRole(e.target.value?.replace(/\s+/g, ' '));
        } else {
          setRole(e.target.value);
        }
      }
    }
  };

  var decodedValue = atob(id);

  // const notify = () => {
  //   toast.dismiss();
  //   toast.error("Please enter only alphabets");
  // };
  const [emailId, setEmailId] = useState('')
  useEffect(() => {
    setShowLoader(true)
    fetch(
      Url.getcustomerDetails.replace("{id}", decodedValue),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((respone) => respone.json())
      .then((data) => {
        setShowLoader(false)
        setIsFilled(data?.DATA?.filled);
        setName(data?.DATA?.feedbackBy);
        setCompanyName(data?.DATA?.project?.customer?.companyName);
        setProjectName(data?.DATA?.project?.projectName);
        setProjectId(data?.DATA?.project?.projectId);
        setRole(data?.DATA?.role);
        setEmailId(data?.DATA?.emailId)
        sessionStorage.setItem("feedbackBy", data?.DATA?.feedbackBy);
        sessionStorage.setItem("custFeedbackId", data.DATA.custFeedbackId);
        sessionStorage.setItem("projectName", data?.DATA?.project?.projectName);
        if (data?.DATA?.filled == true && atob(localStorage.getItem('isAdmin')) == 'admin') {
          navigate(`/app/main/FilledFeedbackForm/${decodedValue}`);
        } else if (data?.DATA?.filled == true && atob(localStorage.getItem('isAdmin')) !== 'admin'){
          navigate(`/app/SubmittedScreen`);
          setIsFilled(false);
        }
      });
  }, []);


  //  ---------- Start feedback put api  ---------------------
  const validate = async () => {
    setShowLoader(true)
    const bodyToSend = {
      custFeedbackId: decodedValue,
      role: role,
      feedbackBy: name,
      emailId: emailId,
      projectDto: {
        projectId: projectId,
      },
    }
    try {
      if (name !== "" && companyName !== "" && projectName !== "") {
        const validateData = await PUTWithoutToken(Url?.getcustomerDetails.replace("{id}", decodedValue), bodyToSend)
        if (validateData?.SUCCESS) {
          setShowLoader(false)
          navigate("/app/main/FeedbackForm");

          const storageData = {
            feedbackBy: validateData?.DATA?.feedbackBy,
            custFeedbackId: validateData?.DATA?.custFeedbackId,
            projectName: validateData?.DATA?.projectName
          };

          for (const [key, value] of Object.entries(storageData)) {
            sessionStorage.setItem(key, value);
          }
          
        } else {
          setShowLoader(false)
        }
      } else {
        setShowLoader(false)
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false)
    }
  }




  // const validate = () => {
  //   setShowLoader(true)
  //   if (name != "" && companyName != "" && projectName != "") {
  //     const headers = {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + sessionStorage.getItem('token'),
  //       "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
  //     };

  //     fetch(Url?.getcustomerDetails.replace("{id}", decodedValue), {
  //       method: "PUT",
  //       headers,
  //       body: JSON.stringify({
  //         custFeedbackId: decodedValue,
  //         role: role,
  //         feedbackBy: name,
  //         emailId: emailId,
  //         projectDto: {
  //           projectId: projectId,
  //         },
  //       }),
  //     })
  //       .then((response) => {
  //         setShowLoader(false)
  //         navigate("/app/main/FeedbackForm");
  //         if (response.ok) {
  //           return response.json();
  //         }
  //         return Promise.reject(response);
  //       })
  //       .then((json) => {
  //        setShowLoader(false)
  //         console.log(json);
  //         sessionStorage.setItem("feedbackBy", json?.DATA?.feedbackBy);
  //         sessionStorage.setItem("custFeedbackId", json.DATA.custFeedbackId);
  //         sessionStorage.setItem(
  //           "projectName",
  //           json?.DATA?.project?.projectName
  //         );
  //       })
  //       .catch((response) => {
  //         console.error(response);
  //         setShowLoader(false)
  //       });
  //   }
  // };

  return (
    <>
      {isFilled == true ? (
        <></>
      ) : (

        <div className="Main_Div">
          <div className="Form_Container_Div1">
            <div className="getStartedLogo_Div">
              <img src={logo} />
            </div>
            <div className="Heading_Div">
              <span className="mainHeadingData">
                Project End Feedback  For {projectName}
              </span>
              <span style={{ fontWeight: 500, fontSize: '14px', width: '84%', margin: '0 auto', color: ' #838383' }}>
                Thank you for partnering with us on the {projectName}. To continue delivering high quality service and improve our future projects, we ask for your feedback.
              </span>
            </div>
            <div className="Input_Container_Div">
              <div className="getStartedInner_Div">
                <div className="getStartedInputs">
                  <div className="loginInput_Label">
                    <label> SPOC</label>
                    <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{name}</p>
                  </div>
                </div>
                <div className="getStartedInputs">
                  <div className="loginInput_Label">
                    <label>Company Name</label>
                  </div>
                  <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{companyName}</p>
                </div>
                <div className="getStartedInputs">
                  <div className="loginInput_Label">
                    <label>Project Name</label>
                  </div>
                  <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{projectName}</p>
                </div>
                <div className="getStartedInputs">
                  <div className="loginInput_Label">
                    <label>Email Id</label>
                  </div>
                  <p style={{ fontSize: "13px", backgroundColor: "#98949433", width: "100%", padding: "8px", color: "#615b5b" }}>{emailId}</p>
                </div>
                <div className="getStartedInputs">
                  <div className="loginInput_Label">
                    <label>Role</label>
                  </div>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => {
                      handleRole(e);
                    }}
                    placeholder="Enter Role"
                    style={{ fontSize: "14px", margin: '4px 0' }}
                  ></input>
                </div>
                <div className="getStartedButton_Container_Div">
                  {isFilled == true ? (
                    <></>
                  ) : (

                    <button
                      onClick={() => {
                        validate();
                      }}
                    >
                      Start Feedback
                    </button>

                  )}
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

      )}
    </>
  );
}

export default Login;
