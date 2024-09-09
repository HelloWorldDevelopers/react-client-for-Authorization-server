import "./CreateLink.css";
import {  useContext, useEffect, useRef, useState } from "react";
import { Url } from "../Constants/APIUrlConstant";
import cancel_btn from '../CustomerFeedback/Assets/cancel.svg'
import ReactModal from 'react-modal';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import copy from 'clipboard-copy';
import search from './SearchIcon.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdContentCopy } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Footer from "../CustomerFeedback/Footer/Footer";
import logoutBtn from '../CustomerFeedback/Assets/logoutBtn.svg';
import Lottie from "lottie-react";
import Loader from "../../src/CustomerFeedback/Assets/loader.json"
import Sidebar from "../Sidebar/Sidebar";
import { contextData } from "../Context/MyContext";
import { CommonUrl, commonEmail, CommonEmailUrl } from '../CommonComponents/CommonUrl'
import { CreateLinkEditIcon, CreateLinkViewIcon } from '../CommonComponents/CommonCreateLink';
import { capitalNameCommon } from '../../src/CommonComponents/capitalNameCommon'
import HeaderDivCommon from '../../src/CommonComponents/HeaderDivCommon'
import useExternalFilter from "../CommonComponents/ExternalFilter"
import { handlePageSizeChange } from './../CommonComponents/Commonpagination';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../CustomerFeedback/Assets/sucess.png'
import CommonCopiedsweetalert from '../../src/CommonComponents/CommonCopiedsweetalert'
import CommonSweetAlertnotifiy from '../../src/CommonComponents/CommonSweetAlertnotifiy'
import exlamentory from '../../src/CustomerFeedback/Assets/exclamation-mark.png';
import {
  EmailSendAlertSuccess,
  EmailSendErrorSuccess,
  EmailSendSuccess,
} from "../../src/CommonComponents/CommonCreateLink";
import { POST } from '../CommonComponents/httpmethods/httpMethods';
import { TfiEmail } from "react-icons/tfi";
import { decryptResponseToken } from '../Constants/EncryptDecryptFunc';
import CommonUpdate from "../CommonComponents/CommonUpdate";
import CommonMailTemplate from "../CommonComponents/MailTemplate/CommonMailTemplate";
import Select from 'react-select';
import CustomStyle from "../CommonComponents/CustomStyle";
function CreateLink() {
  const {
    notifyUpdateSuccess
  } = CommonUpdate()
  const {
    customStyle
  } = CustomStyle()
  const navigate = useNavigate();
  const gridContainerRef = useRef(null);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [role, setRole] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [linkList] = useState([]);
  const [loginName] = useState(atob(sessionStorage.getItem('loginName')))
  const [linkCopied, setLinkCopied] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false)
  const [ClickIdForUpdate, setClickIdForUpdate] = useState()
  const [, setshowLoginModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showMailModel, setShowMailModal] = useState(false)
  const [setCreatedLink] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([]);
  const [mailTemplateData, setMailTemplateData] = useState({
    projectName: '',
    feedbackBy: '',
    id: '',
    email: ''
  })
  const [rowDatatoView, setRowDatatoView] = useState({
    feedbackBy: "",
    companyName: "",
    projectName: "",
    role: "",
  })

  const { sidebarExpanded, openModal } = useContext(contextData)
  const fieldsToCheck = ['feedbackBy', 'companyName', 'projectName', 'role', 'emailId'];
  const { externalFilterChanged, isExternalFilterPresent, doesExternalFilterPass, gridRef } = useExternalFilter(fieldsToCheck);
  const style = {
    width: "25%",
    margin: "0 auto",
  };

  const copyText = (event) => {
    const parentElement = event.currentTarget.parentElement;
    if (parentElement) {
      const siblingElement = parentElement.previousElementSibling;

      if (siblingElement) {
        const textToCopy = siblingElement.textContent || siblingElement.innerText;
        copy(textToCopy);
        setTimeout(() => setLinkCopied(false), 3000);
      };
      notify()
    }
  }

  const handleSortModelChange = (model) => {
    setSortModel(model);

  };

  const navigateToPreview = (params) => {
    const newBase64String = btoa(params?.data?.custFeedbackId);
    sessionStorage.setItem("customerId", newBase64String);
    sessionStorage.setItem("feedbackBy", params?.data?.feedbackBy);
    sessionStorage.setItem('projectName', params?.data?.projectName)
    const ID = sessionStorage.getItem("customerId")
    navigate(`/app/main/FilledFeedbackForm/${ID}`)
  };
  const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false)

  const handleOpenAddSuccModal = () => {
    setshowAddSuccessModal(true);

  };
  const handleCloseAddSuccModal = () => {
    setshowAddSuccessModal(false);;
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);;
  };

  const handleCloseEditSuccModal = () => {
    setShowEditSuccessModal(false);;
  };

  const handleCloseMailModal = () => {
    setShowMailModal(false);
  };

  const handleOpenLoginModal = () => {
    setshowLoginModal(true);
  };


  const notify = () => {
    CommonCopiedsweetalert({ title: "Link Copied" })
  };
  const notifyAlertLogin = () => {
    toast.dismiss();
    toast.warning("Enter Username & Password"); // Use toast.success for a success notification
  };
  const notifyAlertFields = () => {
    toast.dismiss();
    toast.warning("! Enter The Required Fields"); // Use toast.success for a success notification
  };
  const notifyAlertLoginError = () => {
    toast.dismiss();
    toast.error("Username/Password Is Invalid"); // Use toast.success for a success notification
  };
  const notifyLoginSuccess = () => {
    toast.dismiss();
    toast.success("Login Successful"); // Use toast.success for a success notification
  };
  const [rowData, setRowData] = useState([])
  const [columnDefs] = useState([
    { field: "feedbackBy", headerName: 'Name', flex: 0.6, },
    { field: "companyName", headerName: 'Company Name', flex: 0.8 },
    { field: "projectName", headerName: 'Project Name', flex: 0.8 },
    { field: "role", headerName: 'Role', flex: 0.8 },
    {
      field: "url", headerName: 'Link', flex: 1.6,
      cellRenderer: (params) => {
        console.log(params);
        const newBase64String = btoa(params?.data?.custFeedbackId);
        const ab = params?.data?.custFeedbackId;
        let link = `${CommonUrl}#/app/GetStarted/` + newBase64String
        return (
          <div className='ButtonDiv'>
            <a id="elementId" target="_blank" href={link}>{link}</a>
            <div>        <MdContentCopy className="icons" onClick={copyText} />
              {linkCopied ? <small className={`copiedMessage`}>Link Copied</small> : <></>}
            </div>
            {params?.data?.sortStatus === 1 ?
              <BsCheckCircleFill className="icons" values={params?.data?.custFeedbackId} onClick={() => navigateToPreview(params)} style={{ color: 'green' }} /> :
              <></>}
          </div>
        )
      }
    },
  ]);
  useEffect(() => {
    if (atob(sessionStorage.getItem('isAdmin')) == 'admin') {
    }
  })




  const notifyAlertCharacter = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={exlamentory} alt="Custom Icon" className="custom-swal-icon" />
    );
    Swal.fire({
      title: 'Please enter only alphabets',
      html: imageHtml,
      allowOutsideClick: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
      },
      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,
    });

  };

  const notifyLinkSuccess = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
    );
    Swal.fire({

      title: 'Link Created Successfully',
      html: imageHtml,
      allowOutsideClick: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-swal-confirm-button',
      },
      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,
    });
  };
  const updateAlertSuccess = () => {
    CommonSweetAlertnotifiy({ title: "Form Already Filled" })

  };

  const [projectId, setProjectId] = useState('')
  const handleCreateLinkEdit = (id) => {
    if (id?.filled) {
      updateAlertSuccess();
      return;
    }
    setClickIdForUpdate(id.custFeedbackId)
    setName(id.feedbackBy)
    let companyName = {
      value: id?.customerId,
      label: id?.companyName
    }

    let ProjectName = {
      value: id?.projectId,
      label: id?.projectName
    }
    setCompanyName(companyName)
    setProjectName(ProjectName)
    setProjectId(ProjectName?.value)
    setRole(id.role || '-');
    setEmailId(id.emailId)
    handleCompanyName(companyName)
    handleProjectName(ProjectName)
    setShowEditSuccessModal(true)
  }

  const handleView = (customerId) => {
    setRowDatatoView({
      feedbackBy: customerId.feedbackBy,
      companyName: customerId.companyName,
      projectName: customerId.projectName,
      role: customerId.role || '-'
    })
    setEmailId(customerId.emailId)
    setShowViewModal(true);
  }
  const [sortType, setSortType] = useState(false);


  // const [rowData, setRowData] = useState([])
  const [, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAdminEncoded = sessionStorage.getItem('isAdmin');
    if (isAdminEncoded && atob(isAdminEncoded) === 'admin') {
      setIsAdmin(true);
    } else {
      handleOpenLoginModal();
    }
    setShowLoader(true);
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(Url.getAllCustomer, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setShowLoader(false);
          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            setCustomerList(data?.DATA || []);
          }
        })
        .catch((error) => {
          setShowLoader(false);
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  }, []);


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetch(Url.getCreatedLink, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        }
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("API", Url.getCreatedLink, "Result", data)

          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            const allData = data?.DATA
            const arr = []
            allData?.forEach((item, i) => {
              let obj = {
                ...item,
                linkColor: false,
                loader: false
              }
              arr.push(obj)
            })
            setRowData(arr)
          }
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    }

  }, []);
  const OpenCreateModel = () => {
    setName("");
    setCompanyName("");
    setProjectName("");
    setRole("");
    setEmailId('');
    handleOpenAddSuccModal();

  }
  const CloseCreateModel = () => {
    handleCloseAddSuccModal();
  }


  const handleCompanyName = (selectedOption) => {
    const selectedCompanyName = selectedOption ? selectedOption.value : null;
    setCompanyName(selectedCompanyName);
    // Reset project name when company name changes
    fetch(Url.getProjectList.replace("{customerId}", selectedCompanyName), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API getProjectList", Url.getProjectList.replace("{customerId}", selectedCompanyName), "Data", data);

        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          setProjectList(data.DATA);
        }
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setProjectList([]);
      });
  };
  const [projectStatus, setProjectStatus] = useState(false)
  const handleProjectName = (selectedOption) => {
    let selectedProjectName = selectedOption ? selectedOption.value : null
    setProjectName(selectedProjectName);
    setProjectStatus(true)
  };

  const [emailId, setEmailId] = useState('')
  const handleEmailId = (e) => {
    const email = e.target.value?.trim();
    setEmailId(email)
  }

  const handleRole = (e) => {
    let trimmedValue = e.target.value?.trim();
    let pattern = /^[a-zA-Z.-]+(?:\s[a-zA-Z.-]+)*$/;
    const capitalizedText = capitalizeFirstLetters(e.target.value);

    if (!pattern.test(trimmedValue) && trimmedValue != "") {
      if ((e.target.value).includes('  ')) {
        setRole(capitalizedText?.replace(/\s+/g, ' '));
      } else {
        notifyAlertCharacter()
      }
    } else {
      if (trimmedValue == "") {
        setRole("");
      } else {
        if ((e.target.value).includes('  ')) {
          setRole(capitalizedText.replace(/\s+/g, ' '));
        } else {
          setRole(capitalizedText);
        }
      }
    }
  };

  const notifyEmailAlert = (msg) => {
    toast.dismiss();
    toast.error(msg);
  };

  // Email validation function
  const validateEmail = (emailId) => {
    // General regex to validate email format with no dots after @
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if the email matches the general format
    if (!regex.test(emailId)) {
      return false;
    }

    // Split the email into local and domain parts
    const [localPart, domainPart] = emailId.split('@');

    // Ensure no dots in the domain part after the @ symbol
    if (domainPart.includes('..') || domainPart.endsWith('.')) {
      return false;
    }

    // Check for empty segments in domain
    const domainSegments = domainPart.split('.');
    if (domainSegments.length < 2 || domainSegments.some(segment => segment.length === 0)) {
      return false;
    }

    // Ensure no extra dots before the TLD
    const tld = domainSegments.pop();
    if (domainSegments.length > 1) {
      return false;
    }

    // Special case for Gmail
    if (emailId.endsWith('@gmail.com')) {
      if (domainPart !== 'gmail.com') {
        return false;
      }
    }

    // Check against a list of invalid domains
    const invalidDomains = ['rnt.ai', 'rabbitandtortoise.com'];
    for (const domain of invalidDomains) {
      if (emailId.endsWith(`@${domain}`)) {
        return false;
      }
    }

    return true;
  };

  const validateAllFields = () => {

    const fieldValidations = [
      () => validateField(name, 'Please enter a name', (name) => name?.trim() !== ''),
      () => validateField(companyName, 'Please select a company name', (companyName) => companyName != ''),
      () => validateField(projectName, 'Please select a project name', (projectName) => projectName != ''),
      () => validateField(emailId, 'Enter A Valid Customer Email Address', validateEmail)
    ]

    // start validating all fields
    for (const validation of fieldValidations) {
      if (!validation()) {
        return false;
      }
    }
    return true
  };


  const validateField = (value, errorMsg, validator) => {
    if (!validator(value)) {
      notifyEmailAlert(errorMsg);
      return false;
    }
    return true;
  };


  const validate = () => {
    if (!validateAllFields()) {
      return;
    } else {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      };
      setShowLoader(true)
      fetch(Url.login, {
        method: "POST",
        headers,
        body: JSON.stringify({
          role: role,
          feedbackBy: name,
          projectDto: {
            projectId: projectName,
          },
          emailId: emailId
        }),
      })
        .then((response) => {
          setIsFirstRender(true);
          fetch(Url.getCreatedLink, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem('token'),
              "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
            }
          })
            .then((response) => response?.json())
            .then((data) => {
              setShowLoader(false)
              if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                openModal();
              }
              else {
                setSortType(true);
                setRowData(data?.DATA)
                notifyLinkSuccess();
                CloseCreateModel();
                setProjectStatus(false)
              }
            })
            .then((respone) => respone?.json())

          if (response.ok) {
            return response.json();
          }
          return Promise.reject(response);
        }).then((json) => {
          setShowLoader(false)
          const newBase64String = btoa(json.DATA.custFeedbackId);
          // setCreatedLink("http://172.20.1.38:8080/CustomerFeedback/#/GetStarted/" + newBase64String);
          const obj = {
            feedbackBy: json?.DATA?.feedbackBy,
            role: json?.DATA?.role,
            projectName: json?.DATA?.project?.projectName,
            companyName: json?.DATA?.project?.customer?.companyName,
            // url: "http://172.20.1.38:8080/CustomerFeedback/#/GetStarted/" + newBase64String,
          }
          setName('')
          setRole('')
          linkList.push(obj);
        })
        .catch((response) => {
          console.error(response);
          setShowLoader(false)
        });
    }
  };
  const capitalizeFirstLetters = (text) => {
    return text?.replace(/\b\w/g, (char) => char?.toUpperCase());
  };
  const updatevalidate = () => {
    let obj = {
      role: role,
      feedbackBy: name,
      projectDto: {
        projectId: projectStatus ? projectName : projectId
      },
      emailId: emailId
    }
    console.log("API updateCustomerFeedback", Url.updateCustomerFeedback.replace("{id}", ClickIdForUpdate), "Api body", obj)
    if (!validateAllFields()) {
      return;
    } else {
      setShowLoader(true)
      fetch(Url.updateCustomerFeedback.replace("{id}", ClickIdForUpdate), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
        body: JSON.stringify(obj),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            notifyUpdateSuccess()
            fetch(Url.getCreatedLink, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
              },
            })
              .then((respone) => respone.json())
              .then((data) => {
                setShowLoader(false)
                setRowData(data?.DATA)
              });
            setShowEditSuccessModal(false)
          }
        })
        .catch((error) => {
          setShowLoader(false)
        })
    }
  };

  const [logoutBtnOpen, setLogoutBtnOpen] = useState(false);
  const logoutRef = useRef();

  const handleLogout = () => {
    sessionStorage.setItem('isLoggedOut', "true");
    navigate('/')
  };
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setLogoutBtnOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    setIsFirstRender(false)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);



  const gridOptions = {
    domLayout: 'autoHeight',
    enableSorting: true
  };



  const [profileImg, setProfileImage] = useState(null)
  useEffect(() => {
    const staffId = sessionStorage.getItem('staffId');
    const token = sessionStorage.getItem('token');

    if (staffId && token) {
      fetch(Url.getProfilePic.replace("{id}", staffId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
      })
        .then((response) => {
          // if (!response.ok) {
          //   console.error('Network response was not ok', response.status, response.statusText);
          //   throw new Error('Network response was not ok ' + response.statusText);
          // }
          return response.json();
        })
        .then((data) => {
          setShowLoader(false);
          console.log("get profile pic", data);
          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            if (data?.DATA?.profilePicture) {
              setProfileImage(data.DATA.profilePicture);
              sessionStorage.setItem('profilePic', data.DATA.profilePicture);
            }
          }
        })
        .catch((error) => {
          setShowLoader(false);
          console.error('There was a problem with the fetch operation:', error);
        });
    } else {
      setShowLoader(false);
      console.error('Missing staffId or token');
    }
  }, []);
  const handleLinkColor = (custFeedbackId) => {
    setRowData(prevState => {
      const index = prevState.findIndex(item => item.custFeedbackId === custFeedbackId);
      if (index !== -1) {
        return prevState.map((item, idx) => {
          if (idx === index) {
            return {
              ...item,
              linkColor: true
            };
          }
          return item;
        })
      }
      return prevState;
    })
  }
  const btnloaderstyle = {
    width: "100%",
    height: "30px",
  };

  const loaderParentStyles = {
    width: "100%",
    height: "100%",
    background: "",
    color: "#FF004D",
    border: "none",
    borderRadius: "6px",
    opacity: "1",
  };

  const handleEmailShowLoader = async (emailData, custFeedbackId, rowIndex) => {
    const token = sessionStorage.getItem("token");
    const data = emailData;
    const id = custFeedbackId;
    setShowLoader(true)
    try {
      const sendEmail = await POST(
        Url.sendProjectFeedbackEmail?.replace("{id}", id),
        token
      );
      fetch(Url.getCreatedLink, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
      })
        .then((respone) => respone.json())
        .then((data) => {
          setShowLoader(false)
          setRowData(data?.DATA)
        });
      if (sendEmail?.SUCCESS) {
        setShowLoader(false)
        setShowMailModal(false)
        EmailSendSuccess();
      } else {
        setShowLoader(false)
        setShowMailModal(false)
        EmailSendErrorSuccess(sendEmail.MESSAGE);
      }
    } catch (err) {
      console.log(err);
      setShowLoader(false)
    }
  };

  const rbackData = JSON.parse(decryptResponseToken(sessionStorage.getItem('allRbacks')))

  let rbackObj = {
    readAccess: false,
    writeAccess: false,
    editAccess: false,
    deleteAccess: false,
    useCase: false,
    moduleAccess: false
  }

  rbackData?.map((item) => {
    if (item?.useCase === "CUFEE ProjectEndFeedback") {
      const index = rbackData?.findIndex(item => item?.useCase === "CUFEE ProjectEndFeedback");
      const projectObj = rbackData[index]
      rbackObj = {
        readAccess: projectObj?.readAccess === 'Y',
        writeAccess: projectObj?.writeAccess === 'Y',
        editAccess: projectObj?.editAccess === 'Y',
        deleteAccess: projectObj?.deleteAccess === 'Y',
        useCase: projectObj?.useCase === 'Y',
        moduleAccess: projectObj?.moduleAccess
      }
    }
  })
  const [emailData, setEmailData] = useState()
  const [custFeedbackId, setCustFeedbackId] = useState()
  const [linkColor, setLinkColor] = useState()
  const handleOpenModel = (data, color) => {
    if (data?.filled || data?.isEmailSend) {
      setShowMailModal(false)
      EmailSendAlertSuccess();
    }
    else {
      setShowMailModal(true)
      console.log('mail data', data)
      let newId = btoa(data?.custFeedbackId)
      setMailTemplateData({
        projectName: data?.projectName,
        feedbackBy: data?.feedbackBy,
        id: newId,
        email: data?.emailId
      })
      setEmailData(data);
      setCustFeedbackId(data?.custFeedbackId)
      setLinkColor(color)
    }


  }

  const [emailBody, setEmailBody] = useState('');
  useEffect(() => {
    const emailTemplate = {
      salutation: `<p class="email-paragraph">Dear ${mailTemplateData.feedbackBy},</p>`,
      intro: `<p class="email-paragraph">I hope this email finds you well. We greatly appreciate the opportunity to work with you on ${mailTemplateData.projectName}. Your satisfaction is paramount to us, and we are committed to continually improving our services. To that end, we ask your feedback on the project to understand your experience and identify areas for enhancement.</p>`,
      feedbackLink: `<p class="email-paragraph"><a href="${CommonEmailUrl}#/app${`/GetStarted/${mailTemplateData.id}`}" style="cursor: pointer;">${CommonEmailUrl}#/app/GetStarted/${mailTemplateData.id}</a></p>`,
      closing: `<p class="email-paragraph">Your feedback will enable us to better serve you and future clients. We genuinely appreciate your time and input.</p>

      `,
      signature: `
      <br><br/>
      <p>Best Regards,</p><p>RNT Team.</p>
      <p>First Floor, MIDC IT Tower,</p>
      <p>Kharadi, Pune &#45 411014 </p>
      <p>Website:<a href='http ://www.rnt.ai'>
http://www.rnt.ai</a></p>
          <p><img src="${Url?.getRntLogo}" alt="RNT Logo" style="max-width: 100px; height: auto;pointer-events:none"></p>
   ` };

    // Combine the email template parts into a single HTML string
    setEmailBody(`${emailTemplate.salutation}${emailTemplate.intro}${emailTemplate.feedbackLink}${emailTemplate.closing}${emailTemplate.signature}`);
  }, [mailTemplateData]);

  const customerOptions = customerList?.map(item => ({
    value: item?.customerId,
    label: item?.companyName
  })) || [];

  const ProjectOptions = projectList?.map(item => ({
    value: item?.projectId,
    label: item?.projectName
  }))

 
  

  return (
    <div className="Main_Div">
      <HeaderDivCommon profileImg={profileImg} loginName={loginName} logoutBtnOpen={logoutBtnOpen} logoutRef={logoutRef} handleLogout={handleLogout} logoutBtn={logoutBtn} />
      <div className="createLinkWrapper">
        <div className="createLinkSidebar" style={{ width: !sidebarExpanded ? "17%" : "4%", }}>
          <Sidebar />
        </div>
        <div className="createLinkNewDiv" style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
          <div className="DivTable">
            <div className="Heading_Div"
              // style={{ margin: "10px 0 14px 0" }}
              style={{ width: !sidebarExpanded ? "87%" : "" }}
            >
              <span className="createHeading">Project End Feedback</span>
            </div>
            <div className="Table_Container_Dev">
              <div className="Table_Div">
                <div className="searchbtnWrapper">
                  <div className="empShowEntriesOuterDiv">
                    <span className='empShowEntries'>Show Entries </span>
                    <select className='empShowEntriesSelect' value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value), setPageSize, gridContainerRef)}>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className='empSearchbtnMainDiv'>
                    <div className='search_filter'>
                      <img src={search} alt="" />
                      <input type="text" name="" placeholdertextsize="9px" id="searchFil" placeholder='Search' onChange={(e) => externalFilterChanged(e.target.value)} />
                    </div>
                    <div className="Create_Button_Div">
                      <button className="openCreateLink" onClick={() => { OpenCreateModel() }}>Create Link</button>
                    </div>
                  </div>

                </div>
                <div className="ag-theme-alpine agTableDiv" ref={gridContainerRef} key={sidebarExpanded} >
                  <AgGridReact

                    style={{ width: '100.9%' }}

                    key={sidebarExpanded}
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={[
                      { headerName: 'Sr.No', flex: !sidebarExpanded ? 0.6 : 0.5, valueGetter: "node.rowIndex+1", tooltipField: 'Sr.No', headerClass: 'center-header', cellStyle: { textAlign: 'right', padding: '0px 5px' } },
                      { field: "feedbackBy", headerName: 'SPOC', flex: 1.6, tooltipField: 'feedbackBy', sortable: false, headerClass: 'center-header' },
                      { field: "companyName", headerName: 'Company Name', flex: !sidebarExpanded ? 1.9 : 2.1, tooltipField: 'companyName', sortable: false },
                      { field: "projectName", headerName: 'Project Name', flex: 1.7, tooltipField: 'projectName', sortable: false },
                      { field: "role", headerName: 'Role', flex: 1.1, tooltipField: 'role', sortable: false },
                      { field: "createdDate", headerName: 'Created Date', flex: !sidebarExpanded ? 1.6 : 1.3, tooltipField: 'createdDate', sortable: false, cellStyle: { textAlign: 'center', padding: '0px 5px' } },
                      {
                        field: "url", headerName: 'Link', flex: 1.5,
                        cellRenderer: (params) => {
                          const newBase64String = btoa(params?.data?.custFeedbackId);
                          let link = `${CommonUrl}#/app/GetStarted/` + newBase64String;
                          return (
                            <div className='ButtonDiv'>
                              <a className={linkCopied ? 'purpleLink' : ''}
                                id="elementId"
                                target="_blank"
                                href={link}
                                style={{ color: params?.data?.linkColor ? "#9a2784" : "#4343ca" }}
                              >
                                {link}
                              </a>
                              <div>        <MdContentCopy className="icons" onClick={(e) => { copyText(e); handleLinkColor(params?.data?.custFeedbackId) }} />
                                {linkCopied ? <small className='copiedMessage'>Link Copied</small> : <></>}
                              </div>
                            </div>
                          );
                        },
                        tooltipField: 'url',
                      },
                      {
                        headerName: 'Filled', flex: !sidebarExpanded ? 1.3 : 1, sortable: true, sortingOrder: ['asc', 'desc'], field: "sortStatus", ...(isFirstRender && { sort: 'asc' }),
                        cellRenderer: params =>
                          params.data.sortStatus === 1 ?
                            <div className='filledButtonDiv'>
                              <BsCheckCircleFill
                                className="icons"
                                values={params?.data?.custFeedbackId}
                                onClick={() => navigateToPreview(params)}
                                style={{ color: 'green' }}
                              />
                            </div>
                            :
                            <div className='filledButtonDiv'> </div>
                        ,
                        // sortComparator: (v1, v2) => {
                        //     return v1 === v2 ? 0 : v1 ? -1 : 1;
                        // }
                      },
                      {
                        field: "filledDate", headerName: 'Filled On',
                        flex: !sidebarExpanded ? 1.5 : 1.3, tooltipField: 'filledDate', sortable: true, ...(isFirstRender && { sort: 'asc' }), cellStyle: { textAlign: 'center', padding: '0px 5px' }
                      },
                      {
                        headerName: 'Action', width: !sidebarExpanded ? "107px" : '95px', cellClass: "cell-border",
                        cellRenderer: (params) => {
                          return (
                            <div className="createLinkIconDiv">

                              {

                                !params?.data?.loader &&
                                <>

                                  {

                                    (rbackObj?.moduleAccess && rbackObj?.editAccess) &&
                                    <CreateLinkEditIcon handleCreateLinkEdit={handleCreateLinkEdit} data={params.data} />

                                  }

                                  {
                                    (rbackObj?.moduleAccess && rbackObj?.readAccess) &&
                                    <CreateLinkViewIcon handleView={handleView} data={params.data} />
                                  }
                                </>
                              }

                              {/* <CustomerSatisfactionEmailIcon handleSend={CommonCreateL} url={Url.sendProjectFeedbackEmail} id={params?.data?.custFeedbackId} data={params.data} /> */}
                              <>
                                {
                                  (rbackObj?.moduleAccess && rbackObj?.writeAccess) &&
                                  <TfiEmail
                                    className="customerSatiscreateLinkView"
                                    onClick={() => handleOpenModel(params?.data, params?.data?.linkColor)}
                                  // onClick={() => handleEmailShowLoader(params?.data, params?.data?.custFeedbackId, params?.rowIndex)}
                                  />
                                }
                              </>
                            </div>
                          )
                        }
                      }
                    ]}
                    pagination={true}
                    paginationPageSize={pageSize}
                    rowHeight={31}
                    overlayNoRowsTemplate={"No rows to show."}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                    tooltipShowDelay={0}
                    suppressColumnMoveAnimation={false}
                    suppressDragLeaveHidesColumns={true}
                    suppressMovableColumns={true}
                    gridOptions={gridOptions}

                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ReactModal isOpen={showAddSuccessModal} contentLabel="Minimal Modal Example"
        className="Modal modalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseAddSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseAddSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Create Link To Start The Feedback Process</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="Input_Container_Div">
            <div className="Inner_Div InputMainDiv">
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label> SPOC <span className='bug_star'>*</span></label>
                  <input type="text" value={name} onChange={(e) => { capitalNameCommon(e, setName, notifyAlertCharacter, capitalizeFirstLetters) }} placeholder="Enter Name" />
                </div>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Company Name <span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={customerOptions}
                  onChange={handleCompanyName}
                  value={customerOptions?.find(option => option.value === companyName) || null}
                  placeholder="Select Company Name..."
                  isClearable
                  styles={customStyle}
                />
                {/* <select onChange={(e) => { handleCompanyName(e.target.value); setProjectName('') }} value={companyName}>
                  <option value="" disabled>Select Company Name...</option>
                  {customerList?.map((item, i) => (
                    <option value={item?.customerId} key={i}>{item.companyName}</option>
                  ))}
                </select> */}
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Project Name <span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={ProjectOptions}
                  onChange={handleProjectName}
                  value={ProjectOptions?.find(option => option.value === projectName) || null}
                  placeholder="Select Project Name..."
                  isClearable
                  styles={customStyle}
                />
                {/* <select value={projectName} onChange={handleProjectName}>
                  <option value="" disabled>Select Project...</option>
                  {projectList?.map((item, i) => (
                    <option value={item?.projectId} key={item?.projectId}>{item.projectName}</option>
                  ))}
                </select> */}
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Email Id<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={emailId} onChange={(e) => { handleEmailId(e) }} placeholder="Enter Email Id" style={{marginTop:'10px'}}/>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Role</label>
                </div>
                <input type="text" value={role} onChange={(e) => { handleRole(e) }} placeholder="Enter Role" />
              </div>
              <div className="Button_Container_Div buttonCreateLink">
                <button onClick={() => { validate() }}>Create Link</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>

      {/* edit pop up */}

      <ReactModal isOpen={showEditSuccessModal} contentLabel="Minimal Modal Example"
        className="Modal modalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseEditSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseEditSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Update The Customer Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="Input_Container_Div">
            <div className="Inner_Div InputMainDiv">
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label> SPOC <span className='bug_star'>*</span></label>
                  <input type="text" value={name} onChange={(e) => { capitalNameCommon(e, setName, notifyAlertCharacter, capitalizeFirstLetters) }} placeholder="Enter Name" />
                </div>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Company Name <span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={customerOptions}
                  onChange={handleCompanyName}
                  value={customerOptions?.find(option => option.value === companyName) || null}
                  placeholder="Select Company Name..."
                  isClearable
                  styles={customStyle}
                />
                {/* <select onChange={(e) => { handleCompanyName(e.target.value); setProjectName('') }}>
                  <option value={""} disabled>{'Select Company Name'}</option>
                  {customerList?.map((item, i) => {
                    return (
                      <option value={item?.customerId} selected={item?.customerId == companyName} key={i}>{item.companyName}</option>
                    )
                  })}
                </select> */}
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Project Name <span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={ProjectOptions}
                  onChange={handleProjectName}
                  value={ProjectOptions?.find(option => option.value === projectName) || null}
                  placeholder="Select Project Name..."
                  isClearable
                  styles={customStyle}
                />
                {/* <select onChange={(e) => { handleProjectName(e) }} value={projectName}>
                  <option value='' disabled>Select Project Name...</option>
                  {projectList?.map((item) => {
                    return (
                      <option value={item?.projectId} selected={item?.projectId == projectName} key={item?.projectId}>{item.projectName}</option>
                    )
                  })}
                </select> */}
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Email Id<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={emailId} onChange={(e) => { handleEmailId(e) }} placeholder="Enter Email Id" style={{marginTop:'10px'}}/>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Role</label>
                </div>
                <input type="text" value={role} onChange={(e) => { handleRole(e) }} placeholder="Enter Role" />
              </div>
              <div className="Button_Container_Div buttonCreateLink">
                <button onClick={() => updatevalidate()}>Update</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <ReactModal isOpen={showViewModal} contentLabel="Minimal Modal Example"
        className="Modal modalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseViewModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseViewModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>View  Customer Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="Input_Container_Div">
            <div className="Inner_Div InputMainDiv">
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label> SPOC</label>
                  <p className="commonPara">{rowDatatoView.feedbackBy}</p>
                </div>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Company Name</label>
                  <p className="commonPara">{rowDatatoView.companyName}</p>
                </div>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Project Name</label>
                </div>
                <p className="commonPara">{rowDatatoView.projectName}</p>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Email Id</label>
                </div>
                <p className="commonPara">{emailId}</p>
              </div>
              <div className="Inputs createLinkInput">
                <div className="Input_Label">
                  <label>Role</label>
                </div>
                <p className="commonPara">{rowDatatoView.role}</p>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <CommonMailTemplate
        handleCloseMailModal={handleCloseMailModal}
        showMailModel={showMailModel}
        id={custFeedbackId}
        subjectTitle={`Project End Feedback Request : ${mailTemplateData?.projectName}`}
        customerFeedbackMaster='customerFeedbackMaster'
        custFeedbackId='custFeedbackId'
        url={Url.saveCustomerFeedbackMailData}
        msg={emailBody}
        color={linkColor}
        mailTemplateData={mailTemplateData}
        send={() => handleEmailShowLoader(emailData, custFeedbackId)} />
      <ToastContainer
        rtl
      />
      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style} />
      </ReactModal>
    </div>
  );
}

export default CreateLink;
