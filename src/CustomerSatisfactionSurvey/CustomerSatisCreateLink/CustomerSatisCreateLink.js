import React, { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import logoutBtn from '../../CustomerFeedback/Assets/logoutBtn.svg';
import { AgGridReact } from 'ag-grid-react';
import Footer from '../../CustomerFeedback/Footer/Footer';
import search from '../../CreateLink/SearchIcon.svg'
import './CustomerSatisCreateLink.css'
import cancel_btn from '../../CustomerFeedback/Assets/cancel.svg'
import ReactModal from 'react-modal';
import { MdContentCopy } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { Url } from '../../Constants/APIUrlConstant';
import Sidebar from '../../Sidebar/Sidebar';
import copy from 'clipboard-copy';
import Lottie from "lottie-react";
import Loader from "../../../src/CustomerFeedback/Assets/loader.json"
import { ToastContainer, toast } from 'react-toastify';
import { contextData } from '../../Context/MyContext';
import { CommonUrl, commonEmail, CommonEmailUrl} from '../../CommonComponents/CommonUrl'
import CommonCopiedsweetalert from '../../CommonComponents/CommonCopiedsweetalert'

import { CreateLinkEditIcon, CreateLinkViewIcon, CustomerSatisfactionEmailIcon } from '../../CommonComponents/CommonCreateLink'
import CommoncustomerCreatelink from '../../CommonComponents/CommoncustomerCreatelink'
import CommonCreateL from '../../CommonComponents/CommonCreateL'
import HeaderDivCommon from '../../CommonComponents/HeaderDivCommon'
import useExternalFilter from '../../CommonComponents/ExternalFilter'
import { handlePageSizeChange } from '../../CommonComponents/Commonpagination';
import CommonSweetaler from '../../CommonComponents/CommonSweetaler'
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../../CustomerFeedback/Assets/sucess.png'
import CommonSweetAlertnotifiy from '../../CommonComponents/CommonSweetAlertnotifiy'
import {
  EmailSendAlertSuccess,
  EmailSendErrorSuccess,
  EmailSendSuccess,
} from "../../../src/CommonComponents/CommonCreateLink";
import { POST } from '../../CommonComponents/httpmethods/httpMethods';
import { TfiEmail } from "react-icons/tfi";
import { decryptResponseToken } from '../../Constants/EncryptDecryptFunc';
import CommonUpdate from '../../CommonComponents/CommonUpdate';
import CommonMailTemplate from '../../CommonComponents/MailTemplate/CommonMailTemplate';

import Select from 'react-select';
import CustomStyle from '../../CommonComponents/CustomStyle';



const CustomersatisCreateLink = () => {
  const {
    notifyUpdateSuccess
  } = CommonUpdate()
  const {
    customStyle
  } = CustomStyle()
  const gridContainerRef = useRef(null);

  const { sidebarExpanded, openModal } = useContext(contextData)
  const fieldsToCheck = ['contactPersonName', 'contactPersonEmail', 'companyName', 'contactPersonNo', 'emailId', "role"];
  const { externalFilterChanged, isExternalFilterPresent, doesExternalFilterPass, gridRef } = useExternalFilter(fieldsToCheck);

  const [custSatisMailTemplateData, setcustSatisMailTemplateData] = useState({
    feedbackBy: '',
    id: '',
    email: ''
  })
  const navigate = useNavigate();
  const [showMailModel, setShowMailModal] = useState(false)
  const [logoutBtnOpen] = useState(false);
  const [loginName] = useState(atob(sessionStorage.getItem('loginName')))
  const [customerList, setCustomerList] = useState([]);
  const [, setProjectName] = useState("");
  const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [, setRole] = useState("");
  const [name, setName] = useState([]);
  const [rowData, setRowData] = useState([])
  const [linkCopied, setLinkCopied] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false)
  const [clickIdForUpdate, setClickIdForUpdate] = useState(null)
  const [showLoader, setShowLoader] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [, setCustomerId] = useState()
  const [customerName, setCustomerName] = useState('')
  const [profileImg] = useState(sessionStorage.getItem('profilePic'));
  const [rowDatatoView, setRowDatatoView] = useState({
    feedbackBy: "",
    companyName: "",
    projectName: "",
    role: "",
    email: "",
    mobile: "",
  })
  const gridOptions = {
    sortingOrder: ['asc', 'desc'],
    domLayout: 'autoHeight'

  };


  const notify = () => {
    CommonCopiedsweetalert({ title: "Link Copied" })

  };
  const Logoutnotify = () => {
    CommonSweetaler({ title: "Logout Successfully" })

  };
  const logoutRef = useRef();



  const notifyAlertFields = () => {
    toast.dismiss();
    toast.warning("Enter The Required Fields");
  };

  const spocOptions = name?.DATA?.map(item => ({
    value: item.addressId,
    label: item.contactPersonName
  })) || [];

  const handleLogout = () => {
    // Logoutnotify();
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
    // sessionStorage.clear();
    sessionStorage.setItem('isLoggedOut', "true");
    navigate('/')
  };



  const [sortType, setSortType] = useState(false);
  useEffect(() => {
    CommoncustomerCreatelink(rowData, sortType, setRowData)
  }, [sortType])

  const handleOpenAddSuccModal = () => {
    setShowLoader(false)
    setshowAddSuccessModal(true);
    setName("");
    setEmailId("");
    setMobileNo("");
    setCompanyName("");
    setProjectName("");
    setRole("")
  };

  const handleCloseAddSuccModal = () => {
    setshowAddSuccessModal(false);
  };

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
    const newBase64String = btoa(params?.data?.custSatisfactionId);
    sessionStorage.setItem("SatisfactionId", newBase64String);
    const ID = sessionStorage.getItem("SatisfactionId")
    navigate(`/app/main/CSFilledFeedbackForm/${ID}`)
  };
  const handleCreateLinkEdit = (id) => {
    setShowLoader(false)
    console.log("edit click", id)
    if (id?.filled) {
      updateAlertSuccess();
    }
    else {
      setClickIdForUpdate(id.custSatisfactionId)
      setName(id.contactPersonName)
      let object = {
        value: id.customerId,
        label: id.companyName
      }
      let customerName = {
        value: id.addressId,
        label: id.contactPersonName
      }
      setCompanyName(object?.label)
      setCustomerId(id.customerId)
      handleCompanyName(object)
      handleCustomerName(customerName);
      setCustomerName(id.addressId)
      setEmailId(id.contactPersonEmail)
      setMobileNo(id?.contactPersonNo || '-');
      setRole(id.role);
      setShowEditSuccessModal(true)
      fetch(Url.getCustomerEmailMobile.replace("{id}", id.customerId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("get details", data)
          setShowLoader(false)
          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            setName(data);
            setCustomerId(data?.DATA?.customerId)
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setShowLoader(false)
        });
    }
  }

  const customerOptions = customerList?.map(item => ({
    value: item.customerId,
    label: item.companyName
  }));



  const handleCompanyName = (selectedOption) => {
    const selectedCompanyId = selectedOption ? selectedOption.value : null;
    setCompanyName(selectedCompanyId);
    setEmailId("");
    setMobileNo("");
    setCustomerName('')
    if (selectedCompanyId) {
      // Fetch data based on selectedCompanyId
      setShowLoader(true);
      fetch(Url.getCustomerEmailMobile.replace("{id}", selectedCompanyId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched details:+++++", data);
          setShowLoader(false);
          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            setName(data);
            setCustomerId(data?.DATA?.customerId);
            setEmailId(data?.DATA?.contactPersonEmail);
            setMobileNo(data?.DATA?.contactPersonNo);
          }
          if (data?.SUCCESS === false) {
            toast.error(data?.MESSAGE);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setShowLoader(false);
        });
    }
  };
  const handleView = (customerId) => {
    setRowDatatoView({
      feedbackBy: customerId.contactPersonName,
      companyName: customerId.companyName,
      projectName: customerId.projectName,
      role: customerId.role,
      email: customerId.contactPersonEmail,
      mobile: customerId.contactPersonNo || '-'
    })
    setShowViewModal(true);
  }

  useEffect(() => {
    setShowLoader(true);

    fetch(Url.getAllCustomer, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Customer list:", data);
        setShowLoader(false);
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          setCustomerList(data?.DATA || []);
        }
      })
      .catch((error) => {
        setShowLoader(false);
        console.error('Error fetching customer list:', error);
      });
  }, []);
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false);
  }, [])
  const companyOptions = customerList.map(item => ({
    value: item.customerId,
    label: item.companyName
  }));

  useEffect(() => {
    // setShowLoader(true)
    fetch(Url.getCustomerSatisfactionCreateLink, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("satisss", data)
        setShowLoader(false)
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
      });
  }, [name]);



  const handleCloseViewModal = () => {
    setShowViewModal(false);;
  };

  const handleCloseEditSuccModal = () => {
    setShowEditSuccessModal(false);;
  };

  const handleCustomerName = (selectedOption) => {
    const selectedAddressId = selectedOption ? selectedOption.value : null;
    setCustomerName(selectedAddressId);
    setEmailId(""); // Reset other related state variables
    setMobileNo("");
    setRole(""); // Assuming there's a role state to reset as well

    if (selectedAddressId) {
      // Fetch data based on selected customer name
      fetch(Url.getEmail.replace("{id}", selectedAddressId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Email and Mobile fetched:", data);
          if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            setEmailId(data?.DATA?.contactPersonEmail);
            setMobileNo(data?.DATA?.contactPersonNo || '-');
            setShowLoader(false);
          }
        })
        .catch(error => {
          console.error('Error fetching email and mobile:', error);
          setShowLoader(false);
        });
    }
  };

  const updatevalidate = () => {
    if (name != "" && companyName != "") {
      let obj = {
        addressId: customerName
      };

      setShowLoader(true);
      fetch(Url.updateCustomersatisfactionSurvey.replace("{id}", clickIdForUpdate), {
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
          setShowLoader(false);
          if (resData?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            notifyUpdateSuccess();
            setShowLoader(true);

            // Fetch updated data after successful update
            fetch(Url.getCustomerSatisfactionCreateLink, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
              }
            })
              .then((response) => response.json())
              .then((data) => {
                setShowLoader(false);
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                  openModal();
                } else {
                  setRowData(data?.DATA);
                }
              })
              .catch((error) => {
                console.error('Error fetching data after update:', error);
                setShowLoader(false);
              });

            setName("");
            setCompanyName("");
            setProjectName("");
            setEmailId("");
            setMobileNo("" || '-');
            setShowEditSuccessModal(false);
          }
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          setShowLoader(false);
        });
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




  const updateAlertSuccess = () => {
    CommonSweetAlertnotifiy({ title: "Form Already Filled" })
  };


  const validateAllFields = () => {
    const nameValid = validateField(name, 'Please enter a name', (value) => value !== '');
    const emailValid = validateField(emailId, 'Invalid email address!', (value) => /^(?=.{1,64}@.{1,255}$)[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(value));
    const companyNameValid = validateField(companyName, 'Please select company name', (value) => value.trim() !== '');

    return nameValid && emailValid && companyNameValid;
  };



  const validateField = (value, errorMsg, validator) => {
    // Convert value to string to handle various types and trim whitespace
    const valueString = value ? String(value).trim() : '';

    // Check if the value is empty
    if (valueString === '') {
      notifyEmailAlert('Please Fill All Required Fields');
      return false;
    }

    // Validate the value using the provided validator function
    if (!validator(valueString)) {
      notifyEmailAlert(errorMsg);
      return false;
    }

    return true;
  };


  const handleCreateLink = () => {
    if (!validateAllFields()) {
      return;
    }

    else {
      let obj = {
        addressId: customerName
      }
      setShowLoader(true)
      try {
        fetch(Url.customerSatisfactionCreateLink, {
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
            setShowLoader(true)
            fetch(Url.getCustomerSatisfactionCreateLink, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
              }
            })
              .then((respone) => respone.json())
              .then((data) => {
                console.log('satisfaction', data)
                setShowLoader(false)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                  openModal();
                }
                else {
                  setRowData(data?.DATA)
                }
              });
            SuccessfullyAlert();
            setshowAddSuccessModal(false)
            setName("");
            setEmailId("");
            setMobileNo("");
            setCompanyName("");
            setProjectName("");
            setRole("" || "-")
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


  const [pageSize, setPageSize] = useState(10);

  const handleLinkColor = (custSatisfactionId) => {
    setRowData(prevState => {
      const index = prevState.findIndex(item => item.custSatisfactionId === custSatisfactionId);
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

  const handleEmailLoad = async (emailData, custSatisfactionId, rowIndex,) => {
    const token = sessionStorage.getItem("token");
    const data = emailData;
    const id = data?.custSatisfactionId;
    setShowLoader(true)
    try {
      const sendEmail = await POST(
        Url?.sentmailCustomerserve?.replace("{id}", id),
        token
      );
      fetch(Url.getCustomerSatisfactionCreateLink, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("satisss", data)
          setShowLoader(false)
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
    }
  };
  //-------------Rback--------------
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
    if (item?.useCase === "CUFEE CustomerSatisfactionSurvey") {
      const index = rbackData?.findIndex(item => item?.useCase === "CUFEE CustomerSatisfactionSurvey");
      const custoSatiObj = rbackData[index]
      rbackObj = {
        readAccess: custoSatiObj?.readAccess === 'Y',
        writeAccess: custoSatiObj?.writeAccess === 'Y',
        editAccess: custoSatiObj?.editAccess === 'Y',
        deleteAccess: custoSatiObj?.deleteAccess === 'Y',
        useCase: custoSatiObj?.useCase === 'Y',
        moduleAccess: custoSatiObj?.moduleAccess
      }
    }
  })

  const handleCloseMailModal = () => {
    setShowMailModal(false);
  };

  const [emailData, setEmailData] = useState()
  const [custSatisfactionId, setcustSatisfactionId] = useState()
  const [linkColor, setLinkColor] = useState()
  const handleOpenModel = (data, color) => {
    if (data?.filled || data?.isEmailSend) {
      setShowMailModal(false)
      EmailSendAlertSuccess();
    }
    else {
      setShowMailModal(true)
      console.log('mail data', data)
      let newId = btoa(data?.custSatisfactionId)
      setcustSatisMailTemplateData({
        feedbackBy: data?.contactPersonName,
        id: newId,
        email: data?.contactPersonEmail
      })
      setEmailData(data);
      setcustSatisfactionId(data?.custSatisfactionId)
      setLinkColor(color)
    }
  }
  const [emailBody, setEmailBody] = useState('');
  useEffect(() => {
    const emailTemplate = {
      salutation: `<p class="email-paragraph">Dear ${custSatisMailTemplateData.feedbackBy},</p>`,
      intro: `<p class="email-paragraph">We sincerely appreciate your choice of Rabbit And Tortoise Technology Solutions for your needs.</p><p>Your satisfaction is paramount to us, and we’d like to hear about your experience.</p><p>Please take a moment to share your feedback through our brief survey:</p>`,
      feedbackLink: `<p class="email-paragraph"><a href="${CommonEmailUrl}#/app${`/CustomerSatisfactionGetStarted/${custSatisMailTemplateData.id}`}" style="cursor: pointer;">${CommonEmailUrl}#/app/CustomerSatisfactionGetStarted/${custSatisMailTemplateData.id}</a></p>`,
      closing: `<p class="email-paragraph">Your insights are crucial to improving the services we provide.</p><p>We look forward to hearing about your experience and using your feedback to serve you better.</p>`,
      signature: ` <br><br/>
      <p class="best">Best Regards,</p><p>RNT Team.</p>
      <p>First Floor, MIDC IT Tower,</p>
      <p>Kharadi, Pune &#45 411014 </p> 
      <p>Website:<a href='http ://www.rnt.ai'>
http://www.rnt.ai</a></p>
          <p><img src="${Url?.getRntLogo}" alt="RNT Logo" style="max-width: 100px; height: auto;"></p>`
    };

    // Combine the email template parts into a single HTML string
    setEmailBody(`${emailTemplate.salutation}${emailTemplate.intro}${emailTemplate.feedbackLink}${emailTemplate.closing}${emailTemplate.signature}`);
  }, [custSatisMailTemplateData]);
 
  return (
    <div className='customerSatisMain_Div'>
      <HeaderDivCommon profileImg={profileImg} loginName={loginName} logoutBtnOpen={logoutBtnOpen} logoutRef={logoutRef} handleLogout={handleLogout} logoutBtn={logoutBtn} />
      <div className="customerSatiscreateLinkWrapper">
        <div className="customerSatiscreateLinkSidebar"
          style={{ width: !sidebarExpanded ? "17%" : "4%", }}>


          <Sidebar />
        </div>
        <div className="customerSatiscreateLinkNewDiv"
          style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
          <div className="Form_Container_Div DivTable">
            <div className="customerSatisHeading_Div" style={{ width: !sidebarExpanded ? "85%" : "" }}>
              <span className="customerSatiscreateHeading">Customer Satisfaction Survey</span>
            </div>
            <div className="customerSatisTable_Container_Dev">
              <div className="customerSatisTable_Div">
                <div className="customerSatissearchbtnWrapper">
                  <div className="empShowEntriesOuterDiv">
                    <span className='empShowEntries'>Show Entries </span>
                    <select className='empShowEntriesSelect' value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value), setPageSize, gridContainerRef)}>

                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className='empSearchbtnMainDiv'>
                    <div className='customerSatissearch_filter'>
                      <img src={search} alt="" />
                      <input type="text" name="" placeholdertextsize="9px" id="customerSatissearchFil" placeholder='Search' onChange={(e) => externalFilterChanged(e.target.value)} />
                    </div>
                    <div className="customerSatisCreate_Button_Div" onClick={handleOpenAddSuccModal}>
                      <button className="customerSatisopenCreateLink">Create Link</button>
                    </div>
                  </div>

                </div>
                <div className="ag-theme-alpine agTableDiv" ref={gridContainerRef} >

                  <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={[
                      { headerName: 'Sr.No', flex: !sidebarExpanded ? 0.4 : 0.3, valueGetter: 'node.rowIndex+1', tooltipField: 'Sr.No', headerClass: 'center-header', cellStyle: { textAlign: 'right', padding: '0px 5px' } },
                      { field: "contactPersonName", headerName: 'SPOC', flex: sidebarExpanded ? 1.3 : 1.7, tooltipField: 'contactPersonName', sortable: false, headerClass: 'center-header', },                      // { field: "contactPersonEmail", headerName: 'Email ID', width: '180px', tooltipField: 'emailId', sortable: true, },
                      { field: "contactPersonNo", headerName: 'Mobile No', flex: 1, tooltipField: 'customerContactNumber', sortable: false, cellStyle: { textAlign: 'right', padding: '0px 5px' } },
                      { field: "companyName", headerName: 'Company Name', flex: sidebarExpanded ? 1.3 : 1.5, tooltipField: 'companyName', sortable: false, },
                      { field: "formCreatedDate", headerName: 'Created Date', flex: sidebarExpanded ? 0.9 : 1.2, tooltipField: 'createdDate', sortable: false, cellStyle: { textAlign: 'center', padding: '0px 5px' } },
                      {
                        field: "url", headerName: 'Link', flex: 1.2,
                        cellRenderer: (params) => {
                          const newBase64String = btoa(params?.data?.custSatisfactionId);
                          let link = `${CommonUrl}#/app/CustomerSatisfactionGetStarted/` + newBase64String
                          return (
                            <div className='ButtonDiv'>
                              <a id="elementId" target="_blank" href={link} style={{ color: params?.data?.linkColor ? "#9a2784" : "#4343ca" }}>{link}</a>
                              <div>        <MdContentCopy className="icons" onClick={(e) => { copyText(e); handleLinkColor(params?.data?.custSatisfactionId) }} />
                                {linkCopied ? <small className='copiedMessage'>Link Copied</small> : <></>}
                              </div>
                            </div>
                          )

                        },
                        tooltipField: 'url',
                      },
                      {
                        headerName: 'Filled', flex: sidebarExpanded ? 0.7 : 0.9, sortable: true, field: 'filled', ...(isFirstRender && { sort: 'asc' }),
                        cellRenderer: (params) => {
                          return (
                            <div className='filledButtonDiv'>
                              {params?.data?.filled === true ?
                                <BsCheckCircleFill className="icons" values={params?.data?.custSatisfactionId} onClick={() => navigateToPreview(params)} style={{ color: 'green' }} /> :
                                <></>}
                            </div>
                          )
                        }
                      },
                      { field: "filledDate", headerName: 'Filled On', flex: sidebarExpanded ? 0.8 : 1.1, tooltipField: 'filledDate', sortable: true, ...(isFirstRender && { sort: 'asc' }), cellStyle: { textAlign: 'center', padding: '0px 5px' } },
                      {
                        headerName: 'Action', flex: sidebarExpanded ? 0.7 : 0.9, cellClass: "cell-border",
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

                              {
                                (rbackObj?.moduleAccess && rbackObj?.writeAccess) && <TfiEmail
                                  className="customerSatiscreateLinkView"
                                  onClick={() => handleOpenModel(params?.data, params?.data?.linkColor)}
                                />

                              }
                              {/* <CustomerSatisfactionEmailIcon handleSend={CommonCreateL} url={Url.sentmailCustomerserve} id={params?.data?.custSatisfactionId} data={params.data} /> */}
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
                  // onSortChanged={(event) => { console.log('Sort changed:', event) }}                
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
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Create Link To Start The Customer Satisfaction Survey </label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="FormInput_Container_Div">
            <div className="FormInner_Div FormInputMainDiv">
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Company Name <span className='bug_star'>*</span></label>
                </div>

                <Select
                  options={companyOptions}
                  onChange={handleCompanyName}
                  value={companyOptions.find(option => option.value === companyName)}
                  placeholder="Select Company Name..."
                  isClearable
                  styles={customStyle}
                />

              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>SPOC<span className='bug_star'>*</span></label>
                  <Select
                    options={spocOptions}
                    onChange={handleCustomerName}
                    value={spocOptions.find(option => option.value === customerName) || null}
                    placeholder="Select SPOC..."
                    isClearable
                    styles={customStyle}
                  />
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Email ID<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={emailId} placeholder="Enter Email ID" readOnly />
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Mobile No</label>
                </div>
                <input type="text" value={mobileNo} placeholder="Enter Mobile Number" readOnly />
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
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Update The Customer Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="FormInput_Container_Div">
            <div className="FormInner_Div FormInputMainDiv">
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Company Name <span className='bug_star'>*</span></label>
                </div>
                <Select
                  options={companyOptions}
                  onChange={handleCompanyName}
                  value={companyOptions.find(option => option.value === companyName)}
                  placeholder="Select Company Name..."
                  isClearable
                  styles={customStyle}
                />
                {/* <select value={companyName} onChange={(e) => { handleCompanyName(e.target.value); setCustomerName(""); }}>
                  <option value="" disabled>Select Company Name... </option>
                  {customerList?.map((item) => {
                    return (
                      <option key={item?.customerId} selected={item.customerId == companyName} value={item?.customerId}>{item.companyName}</option>
                    )
                  })}
                </select> */}
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="Input_Label">
                  <label> SPOC <span className='bug_star'>*</span></label>
                  <Select
                    options={spocOptions}
                    onChange={handleCustomerName}
                    value={spocOptions.find(option => option.value === customerName) || null}
                    placeholder="Select SPOC..."
                    isClearable
                    styles={customStyle}
                  />
                  {/* <select onChange={(e) => { handleCustomerName(e.target.value) }} value={customerName}>
                    <option value='' disabled selected>Select SPOC...</option>
                    {name?.DATA?.map((item) => {
                      return (
                        <option key={item?.addressId} selected={item?.addressId == customerName} value={item?.addressId}>{item.contactPersonName}</option>
                      )
                    })}
                  </select> */}
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="Input_Label">
                  <label>Email ID <span className='bug_star'>*</span></label>
                  <input type="text" value={emailId} placeholder="Enter Email ID" readOnly />
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="Input_Label">
                  <label>Mobile No</label>
                  <input type="text" value={mobileNo} placeholder="Enter Mobile Number" readOnly />
                </div>
              </div>

              <div className="FormButton_Container_Div FormbuttonCreateLink">
                <button onClick={() => updatevalidate()}>Update</button>
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
          <label style={{ fontWeight: '700', fontSize: '15px' }}>View Customer Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="FormInput_Container_Div">
            <div className="FormInner_Div FormInputMainDiv">
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Company Name </label>
                  <p className="commonPara">{rowDatatoView.companyName} </p>
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>SPOC </label>
                  <p className="commonPara">{rowDatatoView.feedbackBy}</p>
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Email ID </label>
                  <p className="commonPara">{rowDatatoView.email}</p>
                </div>
              </div>
              <div className="FormInputs FormcreateLinkInput">
                <div className="FormInput_Label">
                  <label>Mobile No</label>
                  <p className="commonPara">{rowDatatoView.mobile}</p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </ReactModal>
      <CommonMailTemplate
        handleCloseMailModal={handleCloseMailModal}
        showMailModel={showMailModel}
        subjectTitle='Thank You for Choosing Rabbit And Tortoise Technology Solutions – We’d Love Your Feedback!'
        color={linkColor}
        customerFeedbackMaster='customerSatisfactionMaster'
        custFeedbackId='custSatisfactionId'
        url={Url.savecustomerSatisfactionMaildata}
        id={custSatisfactionId}
        msg={emailBody}
        mailTemplateData={custSatisMailTemplateData}
        send={() => handleEmailLoad(emailData, custSatisfactionId)} />
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

export default CustomersatisCreateLink