import React, { useContext, useEffect, useRef, useState } from 'react'
import './EmployeeCreateLink.css'
import CreatableSelect from 'react-select/creatable';
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import Select from 'react-select';

import logoutBtn from '../../CustomerFeedback/Assets/logoutBtn.svg';
import search from '../../CreateLink/SearchIcon.svg'
import cancel_btn from '../../CustomerFeedback/Assets/cancel.svg'

import { MdContentCopy } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";

import { toast, ToastContainer } from 'react-toastify';

import Loader from "../../../src/CustomerFeedback/Assets/loader.json"
import buttonloader from "../../../src/CustomerFeedback/Assets/emailloader.json";


import Footer from '../../CustomerFeedback/Footer/Footer';
import Sidebar from '../../Sidebar/Sidebar';

import ReactModal from 'react-modal';
import Lottie from "lottie-react";
import CommoncustomerCreatelink from '../../CommonComponents/CommoncustomerCreatelink'

import { Url } from '../../Constants/APIUrlConstant';
import { POST } from '../../CommonComponents/httpmethods/httpMethods';

import copy from 'clipboard-copy';
import 'react-datepicker/dist/react-datepicker.css';
import { contextData } from '../../Context/MyContext';
import { CommonUrl, commonEmail, CommonEmailUrl } from '../../CommonComponents/CommonUrl'
import HeaderDivCommon from '../../CommonComponents/HeaderDivCommon'
import useExternalFilter from "../../CommonComponents/ExternalFilter"
import { handlePageSizeChange } from '../../CommonComponents/Commonpagination';
import CommonSweetAlertnotifiy from '../../CommonComponents/CommonSweetAlertnotifiy'
import CommonCopiedsweetalert from '../../CommonComponents/CommonCopiedsweetalert'
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../../CustomerFeedback/Assets/sucess.png'
import { FaEdit } from 'react-icons/fa';
import { decryptResponseToken } from '../../Constants/EncryptDecryptFunc';
import {
  EmailSendAlertSuccess,
  EmailSendErrorSuccess,
  EmailSendSuccess,
  CreateLinkEditIcon, CreateLinkViewIcon
} from "../../../src/CommonComponents/CommonCreateLink";
import CommonUpdate from '../../CommonComponents/CommonUpdate';
import CommonMailTemplate from '../../CommonComponents/MailTemplate/CommonMailTemplate';
import CustomStyle from '../../CommonComponents/CustomStyle';


const EmployeeCreateLink = () => {

  const {
    notifyUpdateSuccess
  } = CommonUpdate()
  const {
    customStyle
  } = CustomStyle()
  const gridContainerRef = useRef(null);

  const navigate = useNavigate();
  const [logoutBtnOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [loginName] = useState(atob(sessionStorage.getItem('loginName')))
  const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
  const [name, setName] = useState("");
  const [rowData, setRowData] = useState([])
  const [linkCopied, setLinkCopied] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false)
  const [ClickIdForUpdate, setClickIdForUpdate] = useState()
  const [showLoader, setShowLoader] = useState(false);
  const [profileImg] = useState(sessionStorage.getItem('profilePic'))
  const [, setStatus] = useState(false);
  const [projectName, setProjectName] = useState([])
  const [projectManager, setProjectManager] = useState([])
  const [emailId, setemailId] = useState('')
  const [isEmailDisabled, setIsEmailDisabled] = useState(false)
  const [showMailModel, setShowMailModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [rowDatatoView, setRowDatatoView] = useState({
    Employeename: "",
    projectName: '',
    projectManager: '',
    email: ''
  })
  const { sidebarExpanded, openModal } = useContext(contextData)
  const fieldsToCheck = ['Employeename', 'projectName', 'fullName', 'emailId'];
  const { externalFilterChanged, isExternalFilterPresent, doesExternalFilterPass, gridRef } = useExternalFilter(fieldsToCheck);

  const [projectSelect, setProjectSelect] = useState('')
  const [projectManagerSelect, setProjectManaerSelect] = useState('')
  const [managerStatus, setManagerStatus] = useState(false)
  const [employeDetails, setemployeDetails] = useState([])
  const logoutRef = useRef();
  const handleCloseMailModal = () => {
    setShowMailModal(false);
  };

  // -------------------------------------------------- Rback Management ------------------------------------------------- 
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
    if (item?.useCase === "CUFEE EmployeeFeedback") {
      const index = rbackData?.findIndex(item => item?.useCase === "CUFEE EmployeeFeedback");
      const employeeObj = rbackData[index]
      rbackObj = {
        readAccess: employeeObj?.readAccess === 'Y',
        writeAccess: employeeObj?.writeAccess === 'Y',
        editAccess: employeeObj?.editAccess === 'Y',
        deleteAccess: employeeObj?.deleteAccess === 'Y',
        useCase: employeeObj?.useCase === 'Y',
        moduleAccess: employeeObj?.moduleAccess
      }
    }
  })
  // -------------------------------------------------- Rback Management ------------------------------------------------- 



  const handleLogout = () => {
    sessionStorage.setItem('isLoggedOut', "true");
    navigate('/')
  };

  const handleOpenAddSuccModal = () => {
    setshowAddSuccessModal(true);
    setName("");
    setProjectSelect("");
    setProjectManaerSelect("");
    setemailId("");
  };

  const handleCloseAddSuccModal = () => {
    setshowAddSuccessModal(false);
  };

  const [, setStaffId] = useState();
  const [projectId, setProjectId] = useState('')

  const fetchGetProjectManagerDetails = (staffId, projectId, empPerformenceId) => {
    fetch(Url.getProjectManagerDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      },
      body: JSON.stringify({
        staffId: staffId,
        projectId: projectId,
        empPerformenceId: empPerformenceId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(Url.getProjectManagerDetails, "project Manager Result", data);
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          if (data?.SUCCESS) {
            const formattedOptions = data.DATA.map(item => ({
              value: item.staffId,
              label: item.fullName
            }));
            setProjectManager(formattedOptions);
          } else {
            // setProjectManager([]);
            toast.error("Project Doesn't Have A Project Manager");
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching project manager details:', error);
      })
  }


  const handleCreateLinkEdit = (id) => {
    console.log("edit click", id)
    if (id?.filled) {
      updateAlertSuccess();
    } else {
      sessionStorage.setItem('projectManagerEmail', id?.projectManagerEmail)
      let empStaffId = id.employeeMaster?.staffId
      let projectId = id?.project?.projectId
      setClickIdForUpdate(id?.empPerformenceId)
      setName(empStaffId)
      setProjectSelect(projectId)
      handleName(empStaffId)
      handleProjectName(projectId, empStaffId);
      let object = {
        value: id?.projectManagerName,
        label: id?.projectManagerName
      }
      setProjectManaerSelect(object)
      setProjectId(id?.project?.projectId)
      setemailId(id?.projectManagerEmail)
      setShowEditSuccessModal(true)
      fetchGetProjectManagerDetails(empStaffId, projectId, id?.empPerformenceId) 
    }
  }
  const employeeOptions = employeDetails?.map((item) => ({
    value: item?.staffId,
    label: item.fullName
  })) || [];

  const projectNameOptions = projectName?.map((item) => ({
    value: item?.projectId,
    label: item.projectName
  })) || [];


  const handleName = (value) => {
    const selectedName = value;
    setName(selectedName);
    setemailId('');
    setStaffId(value);
    setStatus(true)
    console.log("API getEmployeeProjectList", Url.getEmployeeProjectList.replace("{staffid}", value));
    fetch(Url.getEmployeeProjectList.replace("{staffid}", value), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(Url.getEmployeeProjectList.replace("{staffid}", value), "Result===", data);
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          if (data?.SUCCESS) {
            setProjectName(data?.DATA);
          } else {
            setProjectName([]);
            toast.error("Employee Doesn't Have Project.");
          }
        }
      });
  };

  const handleProjectName = (value, nameId) => {
    setProjectSelect(value);
    setemailId('');

    fetchGetProjectManagerDetails(nameId, value, ClickIdForUpdate)
  };


  console.log('test', projectManager)
  const [getEmailStatus, setemailStatus] = useState('')
  const handleProjectManager = (selectedoption) => {
    console.log('eeeeeeeeee', selectedoption?.label)
    const selectedProjectManager = selectedoption;
    setProjectManaerSelect(selectedProjectManager);
    setManagerStatus(true);
    setemailId('')
    fetch(Url.getEmployeeEmail.replace("{staffId}", selectedProjectManager?.value), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("get email id", data)
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          const email = data?.DATA?.emailId;
          if (email) {
            setemailId(email);
            // If email exists, set it to emailId
            setIsEmailDisabled(true)
          } else {
            setIsEmailDisabled(false)
          }
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error fetching project manager email:', error);
      });
  }

  useEffect(() => {
    fetch(Url.getEmployeeDetails, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      },
    })
      .then((response) => {
        // Check if the response is okay (status in the range 200-299)
        // if (!response.ok) {
        //   throw new Error('Network response was not ok ' + response.statusText);
        // }
        // Return the response as JSON
        return response.json();
      })
      .then((data) => {
        console.log("setemployeDetails employee Details Result", data)
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          setemployeDetails(data?.DATA || []);
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  const validateEmailtem = (emailId) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    
    if (!regex.test(emailId)) {
        return false;
    }

  
    const [localPart, domainPart] = emailId.split('@');

    
    if (domainPart.includes('..') || domainPart.endsWith('.')) {
        return false;
    }

    
    const domainSegments = domainPart.split('.');
    if (domainSegments.length < 2 || domainSegments.some(segment => segment.length === 0)) {
        return false;
    }

   
    if (emailId.endsWith('@gmail.com') && domainPart !== 'gmail.com') {
        return false;
    }

    return true;
};


  const validateAllFields = () => {
    const nameValid = validateField(name, 'Please select an employee', (value) => value?.trim() !== '');
    const projectNameValid = validateField(projectSelect, 'Please select a project name', (value) => value?.trim() !== '');
    const projectManagerValid = validateField(projectManagerSelect?.label, 'Please select a project manager', (value) => value?.trim() !== '');
    const emailValid = validateField(emailId, 'Enter a valid customer email address', validateEmailtem);

    return nameValid && projectNameValid && projectManagerValid && emailValid;
  };
  const validateField = (value, errorMsg, validator) => {
    const stringValue = String(value).trim();  // Convert to string and trim
    if (stringValue === '') {
      notifyEmailAlert('Please Fill All Required Fields');
      return false;
    }
    if (!validator(stringValue)) {
      notifyEmailAlert(errorMsg);
      return false;
    }
    return true;
  };
  const SuccessfullyAlert = () => {
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
        confirmButton: 'custom-ok-button',

      },
      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,


    });
  };

  const handleCloseEditSuccModal = () => {
    setShowEditSuccessModal(false);;
  };
  const updatevalidate = () => {
    setEditMode(false);
    let nameT = name;
    let projectName = projectSelect;
    let projectManager = projectManagerSelect?.label;
    let email = emailId
    const emailValid = validateField(emailId, 'Enter a valid customer email address', validateEmailtem);
    if (nameT != "" && projectName != "" && projectManager != "") {
      if (emailValid) {
        setShowLoader(true);
        let obj = {
          employeeMaster: {
            staffId: name
          },
          project: {
            projectId: projectSelect
          },
          projectManagerName: projectManagerSelect.label,
          projectManagerEmail: emailId
        }
        console.log("updateEmployeeDetails", Url.updateEmployeeDetails?.replace("{id}", ClickIdForUpdate), "API body", obj);
        fetch(Url.updateEmployeeDetails?.replace("{id}", ClickIdForUpdate), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + sessionStorage.getItem('token'),
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
          },
          body: JSON.stringify(obj),
        })
          .then((res) => res.json())
          .then((resData) => {
            console.log(Url.updateEmployeeDetails?.replace("{id}", ClickIdForUpdate), "Result", resData);
            setShowLoader(false)
            if (resData?.MESSAGE?.toLowerCase()?.includes("token expired")) {
              openModal();
            } else {
              if (resData.SUCCESS) {
                notifyUpdateSuccess()
              }
              getEmpDetails()
              setShowEditSuccessModal(false)
            }
          })
          .catch((error) => {
            setShowLoader(false)
          })
      }
    } else {
      notifyAlertFields();
    }
  };

  const style = {
    width: "25%",
    margin: "0 auto",
  };

  const notifyEmailAlert = (msg) => {
    toast.dismiss();
    toast.error(msg);
  };


  const notifyAlertFields = () => {
    toast.dismiss();
    toast.warning("Enter The Required Fields");
  };

  const notify = () => {
    CommonCopiedsweetalert({ title: "Link Copied" })
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);;
  };
  const [sortType] = useState(false);

  useEffect(() => {
    CommoncustomerCreatelink(rowData, sortType, setRowData)
  }, [sortType])

  const getEmpDetails = () => {
    fetch(Url.getEmployeePerformes, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      }
    })
      .then((response) => {
        // Check if the response is okay (status in the range 200-299)
        // if (!response.ok) {
        //   throw new Error('Network response was not ok ' + response.statusText);
        // }
        // Return the response as JSON
        return response.json();
      })
      .then((data) => {
        console.log('employee data', data)
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          const allData = data?.DATA
          const arr = []
          allData?.forEach((item, i) => {
            let rowDataWithFullname = {
              ...item,
              Employeename: item?.employeeMaster?.fullName,
              fullName: item?.employeeMastar?.fullName,
              projectName: item?.project?.projectName,
              emailId: item?.projectManagerEmail,
              filleddate: item?.filledDate,
              createdDate: item?.createdDateForm,
              linkColor: false,
              loader: false
            }
            arr.push(rowDataWithFullname)
          })
          setRowData(arr);
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false);
  }, [])

  useEffect(() => {
    getEmpDetails()
  }, [name]);

  const handleCreateLink = () => {
    if (!validateAllFields()) {
      return;
    }

    else {
      let obj =
      {
        employeeMaster: {
          staffId: name
        },
        project: {
          projectId: projectSelect
        },
        projectManagerName: projectManagerSelect?.label,
        projectManagerEmail: emailId
      }

      setShowLoader(true)
      try {
        fetch(Url.submitEmployeePerformes, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: "Bearer " + sessionStorage.getItem('token'),
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
          },
          body: JSON.stringify(obj)
        }).then((resp) => resp.json())
          .then((res) => {
            setShowLoader(false)
            setIsFirstRender(true);
            if (res?.MESSAGE?.toLowerCase()?.includes("token expired")) {
              openModal();
            } else {
              setShowLoader(true)
              fetch(Url.getEmployeePerformes, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem('token'),
                }
              })
                .then((respone) => respone.json())
                .then((data) => {
                  setShowLoader(false)
                  if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                  } else {
                    setRowData(data?.DATA)
                  }
                });
              if (res.SUCCESS) {
                SuccessfullyAlert();
              }
              setshowAddSuccessModal(false)
              setName("");
              setProjectManaerSelect("");
              setProjectSelect("");
              setemailId("");
            }
          })
          .catch((e) => {
            setShowLoader(false)
            console.log(e);
          })
      }
      catch (e) {
        setShowLoader(false)
        console.log(e);
      }
    }
  }


  const copyText = (event) => {
    const parentElement = event.currentTarget.parentElement;

    if (parentElement) {
      const siblingElement = parentElement.previousElementSibling;

      if (siblingElement) {
        const textToCopy = siblingElement.textContent || siblingElement.innerText;
        copy(textToCopy);
        setLinkCopied(false);
        notify()
      }
    }
  };

  const navigateToPreview = (params) => {
    const newBase64String = btoa(params?.data?.empPerformenceId);
    sessionStorage.setItem("employeeID", newBase64String);

    const ID = sessionStorage.getItem("employeeID")
    navigate(`/app/main/EmployeeFilledFeedback/${ID}`)
  };

  const updateAlertSuccess = () => {
    CommonSweetAlertnotifiy({ title: "Form Already Filled" })

  };

  const handleView = (customerId) => {
    console.log('view click', customerId)
    setRowDatatoView({
      Employeename: customerId.Employeename,
      projectName: customerId.projectName,
      projectManager: customerId.projectManagerName,
      email: customerId.projectManagerEmail
    })
    setShowViewModal(true);
  }


  const [pageSize, setPageSize] = useState(10);

  const gridOptions = {
    domLayout: 'autoHeight'
  };


  const handleLinkColor = (empPerformenceId) => {
    setRowData(prevState => {
      const index = prevState.findIndex(item => item.empPerformenceId === empPerformenceId);
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


  // -------------------------------------------------------------------------------------------- 

  const handleEmail = async (emailData, empPerformenceId, rowIndex,) => {
    const token = sessionStorage.getItem("token");
    const data = emailData;
    const id = data?.empPerformenceId;
    setShowLoader(true)
    try {
      const sendEmail = await POST(
        Url?.sendProjectManagerEmail?.replace("{id}", id),
        token
      );
      getEmpDetails()
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
    }
  };
  
  const [emailData, setEmailData] = useState()
  const [employeeMailTemplateData, setEmployeeMailTemplateData] = useState({
    feedbackBy: '',
    id: '',
    email: '',
    projectManager: ''
  })
  const [linkColor, setLinkColor] = useState()
  const [employeeId, setemployeeId] = useState()
  const handleOpenModel = (data, color) => {
    if (data?.filled || data?.isEmailSend) {
      setShowMailModal(false)
      EmailSendAlertSuccess();
    }
    else {
      setShowMailModal(true)
      console.log('mail data', data)
      let newId = btoa(data?.empPerformenceId)
      setEmployeeMailTemplateData({
        feedbackBy: data?.Employeename,
        id: newId,
        email: data?.projectManagerEmail,
        projectManager: data?.projectManagerName
      })
      setEmailData(data);
      setLinkColor(color)
      setemployeeId(data?.empPerformenceId)
    }
  }

  const handleCreate = (inputValue) => {
    const uniqueId = Date.now(); // Generate a unique ID based on the current timestamp
    const newOption = {
      value: uniqueId, // Use the unique ID as the value
      label: inputValue
    };
    setProjectManager(prevOptions => [...prevOptions, newOption]);
    setProjectManaerSelect(newOption)
    setIsEmailDisabled(false)
    setemailId('')
  };
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (inputValue) => {
    const formattedInputValue = inputValue
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    setInputValue(formattedInputValue);
    return formattedInputValue;
  };

  const handleEdit = (newValue) => {
    const formattedValue = newValue
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/\b\w/g, char => char.toUpperCase());

    setProjectManager(prev =>
      prev.map(option =>
        option.value === projectManagerSelect.value
          ? { ...option, label: formattedValue }
          : option
      )
    );

    setProjectManaerSelect(prev => ({ ...prev, label: formattedValue }))
    setTimeout(() => {
      let managerEmail = sessionStorage.getItem('projectManagerEmail');
      setemailId(managerEmail);
      console.log("Email set after delay:", managerEmail); // Debugging
    }, 100);
    setEditMode(false);
  };

  const handleEditClick = (option) => {
    setEditMode(true);
    setProjectManaerSelect(option);
    setEditValue(option.label);
    setTimeout(() => {
      let managerEmail = sessionStorage.getItem('projectManagerEmail');
      setemailId(managerEmail);
      console.log("Email set after delay:", managerEmail); // Debugging
    }, 100);
  };

  const handleEmailChange = (e) => {
    if (!getEmailStatus) {
      const { value } = e.target;
      setemailId(value);
    }
  }

  console.log('emailid', emailId)

  const [emailBody, setEmailBody] = useState('');
  useEffect(() => {
    const emailTemplate = {
      salutation: `<p class="email-paragraph">Dear ${employeeMailTemplateData?.projectManager},</p>`,
      intro: `<p class="email-paragraph">Your feedback is valuable to improve the service we provide. Please take a few moments to share your thoughts about our employee, ${employeeMailTemplateData?.feedbackBy}.</p>`,
      feedbackLink: `<p class="email-paragraph"><a href="${CommonEmailUrl}#/app${`/EmployeeGetStarted/${employeeMailTemplateData.id}`}" style="cursor: pointer;">${CommonEmailUrl}#/app/EmployeeGetStarted/${employeeMailTemplateData.id}</a></p>`,
      closing: `<p class="email-paragraph">Thank you for taking the time to help us improve. We genuinely appreciate your continued support.</p>`,
      signature: `
      <br><br/>
       <p class="best">Best Regards,</p><p>RNT Team.</p>
      <p>First Floor, MIDC IT Tower,</p>
      <p>Kharadi, Pune &#45 411014 </p> 
      <p>Website:<a href='http ://www.rnt.ai'>
http://www.rnt.ai</a></p>
          <p><img src="${Url?.getRntLogo}" alt="RNT Logo" style="max-width: 100px; height: auto;"></p>`
    };

    // Combine the email template parts into a single HTML string
    setEmailBody(`${emailTemplate.salutation}${emailTemplate.intro}${emailTemplate.feedbackLink}${emailTemplate.closing}${emailTemplate.signature}`);
  }, [employeeMailTemplateData]);
  // -------------------------------------------------------------------------------------------- 

  return (
    <div className='employeeMain_Div'>
      <HeaderDivCommon profileImg={profileImg} loginName={loginName} logoutBtnOpen={logoutBtnOpen} logoutRef={logoutRef} handleLogout={handleLogout} logoutBtn={logoutBtn} />
      <div className="employeeCreateLinkWrapper">
        <div className="employeeCreateLinkSidebar" style={{ width: !sidebarExpanded ? "17%" : "4%", }}>
          <Sidebar />
        </div>
        <div className="employeeCreateLinkNewDiv" style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
          <div className="Form_Container_Div DivTable">
            <div className="employeeHeading_Div" style={{ width: !sidebarExpanded ? "85%" : "" }}>
              <span className="employeecreateHeading" > Employee Feedback</span>
            </div>
            <div className="employeeTable_Container_Dev">
              <div className="employeeTable_Div">
                <div className="employeeSearchbtnWrapper">
                  <div className="empShowEntriesOuterDiv">
                    <span className='empShowEntries'>Show Entries </span>
                    <select className='empShowEntriesSelect' value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value), setPageSize, gridContainerRef)}>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className='empSearchbtnMainDiv'>
                    <div className='employeeSearch_filter'>
                      <img src={search} alt="" />
                      <input type="text" name="" placeholdertextsize="9px" id="employeeSearchFil" placeholder='Search' onChange={(e) => externalFilterChanged(e.target.value)} />
                    </div>
                    <div className="employeeCreate_Button_Div" onClick={handleOpenAddSuccModal}>
                      {
                        (rbackObj?.moduleAccess && rbackObj?.writeAccess) &&
                        <button className="employeeOpenCreateLink">Create Link</button>
                      }

                    </div>
                  </div>

                </div>
                <div className="ag-theme-alpine agTableDiv" ref={gridContainerRef} style={{ width: '100%' }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={[
                      {
                        headerName: 'Sr.No',
                        flex: !sidebarExpanded ? 0.4 : 0.3,
                        sort: false, valueGetter: 'node.rowIndex+1',
                        tooltipField: 'Sr.No', headerClass: 'center-header', cellStyle: { textAlign: 'right', padding: '0px 5px' }
                      },
                      { field: "Employeename", headerName: ' Employee Name', flex: !sidebarExpanded ? 1.3 : 1.2, headerClass: 'center-header', tooltipField: 'Employeename', sortable: false, },
                      { field: "projectName", headerName: 'Project', flex: !sidebarExpanded ? 1.3 : 1.5, tooltipField: 'projectName', sortable: false, },
                      { field: "projectManagerName", headerName: 'Project Manager', flex: !sidebarExpanded ? 1.3 : 1, tooltipField: 'projectManagerName', sortable: false, },
                      { field: "createdDateForm", headerName: 'Created Date', flex: !sidebarExpanded ? 1.3 : 0.8, tooltipField: 'createdDate', sortable: false, cellStyle: { textAlign: 'center', padding: '0px 5px' } },

                      {
                        field: "url", headerName: 'Link', flex: 1,
                        cellRenderer: (params) => {
                          const newBase64String = btoa(params?.data?.empPerformenceId);
                          let link = `${CommonUrl}#/app/EmployeeGetStarted/` + newBase64String
                          return (
                            <div className='ButtonDiv'>
                              {
                                (rbackObj?.moduleAccess && rbackObj?.writeAccess) ?
                                  <a id="elementId" target="_blank" href={link} style={{ color: params?.data?.linkColor ? "#9a2784" : "#4343ca" }}>{link}</a>

                                  :
                                  <span>{link}</span>
                              }

                              <div>        <MdContentCopy className="icons" onClick={(e) => { copyText(e); handleLinkColor(params?.data?.empPerformenceId) }} />
                                {linkCopied ? <small className='copiedMessage'>Link Copied</small> : <></>}
                              </div>
                            </div>
                          )
                        },
                        tooltipField: 'url',
                      },
                      {
                        headerName: 'Filled', flex: !sidebarExpanded ? 0.9 : 0.7, sortable: true, field: 'sortStatus',
                        sortingOrder: ['asc', 'desc']
                        ,
                        ...(isFirstRender && { sort: 'asc' }),
                        cellRenderer: params =>
                          params.data.sortStatus === 1 ?
                            <div className='filledButtonDiv'>
                              <BsCheckCircleFill
                                className="icons"
                                values={params?.data?.empPerformenceId}
                                onClick={() => navigateToPreview(params)}
                                style={{ color: 'green' }}
                              />
                            </div>
                            :
                            <div className='filledButtonDiv'> </div>
                        ,
                      },
                      { field: "filledDate", headerName: 'Filled On', flex: !sidebarExpanded ? 1.2 : 0.8, tooltipField: 'filleddate', sortable: true, ...(isFirstRender && { sort: 'asc' }), cellStyle: { textAlign: 'center', padding: '0px 5px' } },
                      {
                        headerName: 'Action', flex: !sidebarExpanded ? 0.95 : 0.7, cellClass: "cell-border",
                        cellRenderer: (params) => {
                          return (
                            <div className="createLinkIconDiv">
                              {
                                !params?.data?.loader &&

                                <>
                                  {
                                    (rbackObj?.moduleAccess && rbackObj?.editAccess) &&
                                    <CreateLinkEditIcon handleCreateLinkEdit={handleCreateLinkEdit} data={params.data} style={{ display: params?.data?.loader ? "none" : "block" }} />
                                  }

                                  {
                                    (rbackObj?.moduleAccess && rbackObj?.readAccess) &&

                                    <CreateLinkViewIcon handleView={handleView} data={params.data} style={{ display: params?.data?.loader ? "none" : "block" }} />
                                  }

                                </>

                              }
                              {params?.data?.loader ? (
                                <div className="miniloader" style={{ width: "80px", height: "30px" }}>
                                  <div className="loaderparent" style={loaderParentStyles}>
                                    <Lottie
                                      animationData={buttonloader}
                                      loop={true}
                                      style={btnloaderstyle}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {
                                    (rbackObj?.moduleAccess && rbackObj?.writeAccess) &&
                                    <TfiEmail
                                      className="customerSatiscreateLinkView"
                                      onClick={() => handleOpenModel(params?.data, params?.data?.linkColor)}
                                    />
                                  }
                                </>

                              )}
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
                  ></AgGridReact>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ReactModal isOpen={showAddSuccessModal} contentLabel="Minimal Modal Example"
        className="Modal FormmodalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseAddSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseAddSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Create Link To Start The Employee Feedback Process</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="FormInput_Container_Div">
            <div className="FormInner_Div FormInputMainDiv">
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Employee Name <span className='bug_star'>*</span></label>
                  <Select
                    options={employeeOptions}
                    onChange={(selectedOption) => {
                      handleName(selectedOption ? selectedOption.value : '');
                      setProjectSelect('');
                      setProjectManaerSelect('');
                    }}
                    value={employeeOptions.find(option => option.value === name) || null}
                    placeholder="Select Employee Name..."
                    isClearable
                    styles={customStyle}
                  />
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Name<span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={projectNameOptions}
                  onChange={(selectedOption) => {
                    handleProjectName(selectedOption ? selectedOption.value : '', name);
                    setProjectManaerSelect('');
                  }}
                  value={projectNameOptions.find(option => option.value === projectSelect) || null}
                  placeholder="Select Project Name..."
                  isClearable
                  styles={customStyle}
                />
                {/* <Select
        options={projectNameOptions}
        onChange={(selectedOption) => {
          handleProjectName(selectedOption ? selectedOption.value : '');
          setProjectSelect(''); 
          setProjectManaerSelect('');
        }}
        value={projectNameOptions.find(option => option.value === name) || null}
        placeholder="Select Project Name..."
        isClearable
      /> */}





              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Manager<span className='bug_star'>*</span></label>
                </div>
                <CreatableSelect
                  isClearable={false}
                  isLoading={loading}
                  onChange={handleProjectManager}
                  onCreateOption={handleCreate}
                  options={projectManager}
                  value={projectManagerSelect}
                  placeholder="Select Project Manager..."
                  styles={customStyle}
                  onInputChange={handleInputChange}
                  inputValue={inputValue}
                />
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Manager Email<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={emailId} placeholder="Enter Project Manager Email" onChange={handleEmailChange} disabled={isEmailDisabled} />
              </div>
              <div className="FormButton_Container_Div FormbuttonCreateLink">
                <button onClick={handleCreateLink}>Create Link</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>

      {/* Edit Pop Up */}

      <ReactModal isOpen={showEditSuccessModal} contentLabel="Minimal Modal Example"
        className="Modal modalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseEditSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseEditSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Update The Employee Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="FormInput_Container_Div">
            <div className="FormInner_Div FormInputMainDiv">
              <div className="FormInputs FormcreateLinkInput">
                <div className="Input_Label">
                  <label>Employee Name <span className='bug_star'>*</span></label>
                  <Select
                    options={employeeOptions}
                    onChange={(selectedOption) => {
                      handleName(selectedOption ? selectedOption.value : '');
                      setProjectSelect('');
                      setProjectManaerSelect('');
                    }}
                    value={employeeOptions.find(option => option.value === name) || null}
                    placeholder="Select Employee Name..."
                    isClearable
                    styles={customStyle}
                  />
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Name<span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={projectNameOptions}
                  onChange={(selectedOption) => {
                    handleProjectName(selectedOption ? selectedOption.value : '', name);
                    setProjectManaerSelect('');
                  }}
                  value={projectNameOptions.find(option => option.value === projectSelect) || null}
                  placeholder="Select Project Name..."
                  isClearable
                  styles={customStyle}
                />
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Manager<span className='bug_star'>*</span></label>
                </div>
                <CreatableSelect
                  isClearable={false}
                  isLoading={loading}
                  onChange={handleProjectManager}
                  onCreateOption={handleCreate}
                  options={projectManager}
                  value={projectManagerSelect}
                  placeholder="Select Project Manager..."
                  styles={customStyle}
                  onInputChange={handleInputChange}
                  inputValue={inputValue}
                  components={{
                    Option: (props) => {
                      const { data, innerRef, innerProps, selectOption } = props;

                      return (
                        <div
                          ref={innerRef}
                          {...innerProps}
                          style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer' }}
                        >
                          <div style={{ flexGrow: 1 }}>{data.label}</div>
                          <FaEdit
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                            onClick={() => handleEditClick(data)}
                          />
                        </div>
                      );
                    }
                  }}
                />

                {editMode && (
                  <div>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleEdit(editValue)}
                      placeholder="Edit selected project manager..."
                      autoFocus
                    />
                  </div>
                )}
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Manager Email<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={emailId} placeholder="Enter Project Manager Email" onChange={handleEmailChange} disabled={isEmailDisabled} />

              </div>
              <div className="FormButton_Container_Div FormbuttonCreateLink">
                <button onClick={() => { updatevalidate() }}>Update</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>



      {/* View Pop Up */}
      <ReactModal isOpen={showViewModal} contentLabel="Minimal Modal Example"
        className="Modal modalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseViewModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseViewModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>View  Employee Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="FormInput_Container_Div">
            <div className="FormInner_Div FormInputMainDiv">
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Employee Name</label>
                  <p className="commonPara">{rowDatatoView.Employeename}</p>
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Name</label>
                </div>
                <p className="commonPara">{rowDatatoView.projectName}</p>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Project Manager</label>
                  <p className="commonPara">{rowDatatoView.projectManager} </p>
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Email Id</label>
                </div>
                <p className="commonPara">{rowDatatoView.email}</p>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <CommonMailTemplate
        handleCloseMailModal={handleCloseMailModal}
        showMailModel={showMailModel}
        color={linkColor}
        id={employeeId}
        customerFeedbackMaster='employeePerformenceMaster'
        custFeedbackId='empPerformenceId'
        url={Url.saveEmployeeMailData}
        subjectTitle={`We Value Your Feedback on the Performance for ${employeeMailTemplateData?.feedbackBy}`}
        msg={emailBody}
        mailTemplateData={employeeMailTemplateData}
        send={() => handleEmail(emailData)} />

      <ToastContainer
        rtl
      />


      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style} />
      </ReactModal>


    </div>
  )
}

export default EmployeeCreateLink