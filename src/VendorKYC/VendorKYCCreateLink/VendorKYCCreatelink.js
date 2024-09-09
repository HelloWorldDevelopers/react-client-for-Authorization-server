import React, { useEffect, useRef, useState, useContext } from 'react'
import './VendorKYCCreateLink.css'
import logoutBtn from '../../CustomerFeedback/Assets/logoutBtn.svg';
import Sidebar from '../../Sidebar/Sidebar';
import Footer from '../../CustomerFeedback/Footer/Footer';
import search from '../../CreateLink/SearchIcon.svg'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';
import { MdContentCopy } from "react-icons/md";
import { BsCheckCircleFill, BsFillDashCircleFill } from "react-icons/bs";
import copy from 'clipboard-copy';
import { Url } from '../../Constants/APIUrlConstant';
import cancel_btn from '../../CustomerFeedback/Assets/cancel.svg'
import ReactModal from 'react-modal';
import Loader from "../../CustomerFeedback/Assets/loader.json"
import Lottie from "lottie-react";
import { FaRegEdit } from "react-icons/fa";
import { LuEye } from "react-icons/lu";
import { contextData } from '../../Context/MyContext';
import { CommonUrl, commonEmail, CommonEmailUrl } from '../../CommonComponents/CommonUrl'
import { capitalNameCommon } from '../../CommonComponents/capitalNameCommon'
import HeaderDivCommon from '../../CommonComponents/HeaderDivCommon'
import useExternalFilter from '../../CommonComponents/ExternalFilter'
import { handlePageSizeChange } from '../../CommonComponents/Commonpagination';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import loginsucess from '../../CustomerFeedback/Assets/sucess.png'
import CommonSweetAlertnotifiy from '../../CommonComponents/CommonSweetAlertnotifiy'
import { decryptResponseToken } from '../../Constants/EncryptDecryptFunc';
import copieIcon from '../../CustomerFeedback/Assets/sucess.png'
import { TfiEmail } from "react-icons/tfi";

import {
  EmailSendAlertSuccess,
  EmailSendErrorSuccess,
  EmailSendSuccess,
} from "../../../src/CommonComponents/CommonCreateLink";

import { POST } from "./../../CommonComponents/httpmethods/httpMethods";
import CommonUpdate from '../../CommonComponents/CommonUpdate';
import CommonMailTemplate from '../../CommonComponents/MailTemplate/CommonMailTemplate';


const VendorKYCCreateLink = () => {
  const {
    notifyUpdateSuccess
  } = CommonUpdate()
  const { sidebarExpanded, openModal } = useContext(contextData)

  const navigate = useNavigate();
  const logoutRef = useRef();
  const [logoutBtnOpen] = useState(false);
  const [loginName,] = useState(atob(sessionStorage.getItem('loginName')))
  const [linkCopied, setLinkCopied] = useState(false);
  const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
  const [, setAlternateNo] = useState("");
  const [contactPos, setContactPos] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [name, setName] = useState("");
  const [rowData, setRowData] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false)
  const [ClickIdForUpdate, setClickIdForUpdate] = useState()
  const [profileImg,] = useState(sessionStorage.getItem('profilePic'))
  const [showMailModel, setShowMailModal] = useState(false)
  const [filteredData, setFilteredData] = useState(rowData);
  const fieldsToCheck = ['tradeName', 'contactName', 'emailId', 'mobileNo'];
  const { externalFilterChanged, isExternalFilterPresent, doesExternalFilterPass, gridRef } = useExternalFilter(fieldsToCheck);

  const { vendorCreateLinkTable, setVendorCreateLinkTable } = useContext(contextData);


  const rbackData = JSON.parse(decryptResponseToken(sessionStorage.getItem('allRbacks')))

  let rbacks = {
    readAccess: false,
    writeAccess: false,
    editAccess: false,
    deleteAccess: false,
    useCase: false,
    moduleAccess: false
  }

  const handleCloseMailModal = () => {
    setShowMailModal(false);
  };

  rbackData?.map((item) => {
    if (item?.useCase === "CUFEE VendorOnboarding") {
      const index = rbackData?.findIndex(item => item?.useCase === "CUFEE VendorOnboarding");
      const vendorObj = rbackData[index]
      rbacks = {
        readAccess: vendorObj?.readAccess === 'Y',
        writeAccess: vendorObj?.writeAccess === 'Y',
        editAccess: vendorObj?.editAccess === 'Y',
        deleteAccess: vendorObj?.deleteAccess === 'Y',
        useCase: vendorObj?.useCase === 'Y',
        moduleAccess: vendorObj?.moduleAccess
      }
    }
  })

  const style1 = {
    width: "25%",
    margin: "0 auto",
  };

  const notify = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={copieIcon} alt="Custom Icon" className="custom-swal-icon" />
    );
    Swal.fire({
      title: 'Link Copied',
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

  const notifyEmailAlert = (msg) => {
    toast.dismiss();
    toast.error(msg);
  };

  const Logoutnotify = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
    );
    Swal.fire({
      title: 'Logout Successfully',
      html: imageHtml,
      allowOutsideClick: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
      },
    });
  };
  const handleLogout = () => {
    sessionStorage.setItem('isLoggedOut', "true");
    navigate('/')
  };




  const copyText = (event) => {
    event.view.localStorage.role = '';
    event.view.sessionStorage.role = '';
    const parentElement = event.currentTarget.parentElement;
    console.log('copytext', event.view)
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
  const [navStatus, setNavStatus] = useState(false);
  const navigateToPreview = (params) => {
    setNavStatus(!navStatus);
    sessionStorage.setItem("ID", params?.data?.vendorKycId);
    sessionStorage.setItem("Status", !navStatus);
    navigate('/app/main/FilledVendorForm')
  };




  const handleOpenAddSuccModal = () => {
    setshowAddSuccessModal(true);
    setName("");
    setContactPos('');
    setEmailId("");
    setMobileNo("");
    setAlternateNo("")
  };

  const handleCloseAddSuccModal = () => {
    setshowAddSuccessModal(false);;
  };

  const handleCloseEditSuccModal = () => {
    setShowEditSuccessModal(false);;
  };

  const handleCloseViewSuccModal = () => {
    setShowViewModal(false);;
  };

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    setIsFirstRender(false);
  }, [])

  const fetchGetAllCreateLink = () => {
    setShowLoader(true);
    fetch(Url.getAllCreateLink, {
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
          setVendorCreateLinkTable(arr)
          setFilteredData(arr)
          setRowData(arr);
        }
      })
      .catch((error) => {
        setShowLoader(false);
        console.error('There was a problem with the fetch operation:', error);
      })
  }


 
  useEffect(() => {
    fetchGetAllCreateLink();
  }, [fetchAgain]);



  const capitalizeFirstLetters = (text) => {
    return text?.replace(/\b\w/g, (char) => char?.toUpperCase());
  };




  const handleContactPos = (e) => {
    let trimmedValue = e.target.value?.trim();
    let pattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
    const capitalizedText = capitalizeFirstLetters(e.target.value);
    if (!pattern.test(trimmedValue) && trimmedValue != "") {
      if ((e.target.value).includes('  ')) {
        setContactPos(capitalizedText?.replace(/\s+/g, ' '));
      } else {
        notifyAlertCharacter()
      }
    } else {
      if (trimmedValue == "") {
        setContactPos("");
      } else {
        if ((e.target.value).includes('  ')) {
          setContactPos(capitalizedText?.replace(/\s+/g, ' '));
        } else {
          setContactPos(capitalizedText);
        }
      }
    }
  }

  const handleEmailId = (e) => {
    const value = e.target.value?.replace(/\s+/, '');
    setEmailId(value);
  };


  const handleMobileNo = (e) => {
    let value = e.target.value?.trim();
    if (value !== '' && !/^\d+$/.test(value)) {
      notifyAlertDigits();
      return;
    }
    value = value?.replace(/^\s+/, '');
    value = value?.replace(/ {2,}/g, ' ');
    setMobileNo(value);
  };

  const validateAllFields = () => {
    const nameValid = validateField(name, 'Please enter a name', (value) => value?.trim() !== '');
    const contactPosValid = validateField(contactPos, 'Please enter a contact position', (value) => value?.trim() !== '');
    const emailValid = validateField(
      emailId,
      'Please Enter a Valid Email Address',
      (value) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const blockedDomainRegex = /@rnt\.ai$/;
        return regex.test(value) && !blockedDomainRegex.test(value);
      }
    );
    const mobileNoValid = validateField(
      mobileNo,
      'Please enter a valid 10-digit mobile number',
      (value) => /^\d{10}$/.test(value)
    );

    return nameValid && contactPosValid && emailValid && mobileNoValid;
  };

  const validateField = (value, errorMsg, validator) => {
    if (value?.trim() === '') {
      notifyEmailAlert('Please Fill All Required Fields');
      return false;
    }
    if (!validator(value)) {
      notifyEmailAlert(errorMsg);
      return false;
    }
    return true;
  };

  const notifyAlertCharacter = () => {
    toast.dismiss();
    toast.error("Please enter only alphabets");
  };

  const notifyAlertDigits = () => {
    toast.dismiss();
    toast.error("Please enter only digits");
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

  const handleCreateLink = () => {
    if (!validateAllFields()) {
      return;
    } else {
      let obj = {
        tradeName: name,
        contactName: contactPos,
        emailId: emailId,
        mobileNo: mobileNo,
      }

      setShowLoader(true)
      try {
        fetch(Url.createVendorLink, {
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
              fetch(Url.getAllCreateLink, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem('token'),
                  "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
                }
              })
                .then((response) => response.json())
                .then((data) => {
                  setShowLoader(false)
                  setRowData(data?.DATA)
                  SuccessfullyAlert();
                  setshowAddSuccessModal(false)
                  setName("");
                  setContactPos('');
                  setEmailId("");
                  setMobileNo("");
                  setAlternateNo("")
                  setFetchAgain(!fetchAgain)
                });
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



  const updateAlertSuccess = () => {
    CommonSweetAlertnotifiy({ title: "Form Already Filled" })


  };

  const handleCreateLinkEdit = (id) => {
    if (id?.formFilled) {
      updateAlertSuccess();
      return;
    }
    setClickIdForUpdate(id.vendorKycId)
    setName(id.tradeName)
    setEmailId(id.emailId)
    setMobileNo(id.mobileNo)
    setContactPos(id.contactName)
    setShowEditSuccessModal(true)
  }

  const handleView = (customerId) => {
    setName(customerId.tradeName)
    setEmailId(customerId.emailId)
    setMobileNo(customerId.mobileNo)
    setContactPos(customerId.contactName)
    setShowViewModal(true);
  }

  const handleUpdateLink = () => {
    // setShowLoader(true)
    if (!validateAllFields()) {
      return;
    }
    else {
      let obj = {
        vendorKycId: ClickIdForUpdate,
        contactName: contactPos,
        tradeName: name,
        emailId: emailId,
        mobileNo: mobileNo
      }

      fetch(Url.updateVendorCreateLink, {
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
          setShowLoader(false)
          if (resData?.MESSAGE?.toLowerCase()?.includes("token expired")) {
            openModal();
          } else {
            notifyUpdateSuccess()
            fetch(Url.getAllCreateLink, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
              },
            })
              .then((response) => response.json())
              .then((data) => {
                setShowLoader(false)
                setRowData(data?.DATA)
                setFetchAgain(!fetchAgain)
              });
            setShowEditSuccessModal(false)
          }
        })
        .catch((error) => {
          console.log("updateVendorCreateLink error", error)
          setShowLoader(false)
        })
    }
  }

  const [pageSize, setPageSize] = useState(10);
  const gridContainerRef = useRef(null);

  const gridOptions = {
    domLayout: 'autoHeight'
  };
  const [sortType, setSortType] = useState(false);

  const handleSortFilledValues = () => {
    const finalData = [];
    const filled = [];
    const nonFilled = [];
    rowData.forEach((item) => {
      if (item?.status) {
        filled?.push(item)
      }
      else {
        nonFilled?.push(item)
      }
    })
    if (sortType) {
      nonFilled?.forEach((row) => { finalData.push(row) })
      filled?.forEach((row) => { finalData.push(row) });
      setRowData(finalData)
    }
    else {
      filled?.forEach((row) => { finalData.push(row) });
      nonFilled?.forEach((row) => { finalData.push(row) })
      setRowData(finalData);
    }
  }

  useEffect(() => {
    handleSortFilledValues();
  }, [sortType])

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

  const handleEmailStatusCheck = async (emailData, kycId, rowIndex) => {
    const token = sessionStorage.getItem("token");
    const data = emailData;
    const id = data?.vendorKycId;
    let indexToSet = null
    setShowLoader(true)
    try {
      const sendEmail = await POST(
        Url?.sendVendorEmail?.replace("{id}", id),
        token
      );
      fetchGetAllCreateLink();
      if (sendEmail?.SUCCESS === true) {
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

  const handleLinkColor = (vendorKycId) => {
    setVendorCreateLinkTable(prevState => {
      const updatedState = prevState.map(item => {
        if (item.vendorKycId === vendorKycId) {
          return {
            ...item,
            linkColor: true
          };
        }
        return item;
      });
      return updatedState;
    });
  }
  const [emailData, setEmailData] = useState()
  const [vendorMailTemplateData, setVendorMailTemplateData] = useState({
    feedbackBy: '',
    id: '',
    email: ''
  })
  const [linkColor, setLinkColor] = useState()
  const [vendorId, setvendorId] = useState()
  const handleOpenModel = (data, color) => {
    if (data?.formFilled || data?.isEmailSend) {
      setShowMailModal(false)
      EmailSendAlertSuccess();
    }
    else {
      setShowMailModal(true)
      console.log('mail data', data)
      let newId = btoa(data?.vendorKycId)
      setVendorMailTemplateData({
        feedbackBy: data?.contactName,
        id: newId,
        email: data?.emailId
      })
      setEmailData(data);
      setLinkColor(color)
      setvendorId(data?.vendorKycId)
    }
  }


  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Capitalize first letters
    const capitalizeFirstLetters = (str) =>
      str.replace(/\b\w/g, char => char.toUpperCase());

    const capitalizedValue = capitalizeFirstLetters(inputValue);

    setName(capitalizedValue);


  };

  const [emailBody, setEmailBody] = useState('');
  useEffect(() => {
    const emailTemplate = {
      salutation: `<p class="email-paragraph">Dear ${vendorMailTemplateData?.feedbackBy},</p>`,
      intro: `<p class="email-paragraph">I hope this email finds you well. We are thrilled to welcome you to Rabbit And Tortoise Technology Solutions as one of our valued vendors. We believe that our partnership will bring mutual benefits and contribute to our shared success.</p><p>To ensure a smooth onboarding process, we have outlined the necessary steps and information required from your end.</p>`,
      feedbackLink: `<p class="email-paragraph"><a href="${CommonEmailUrl}#/app${`/KYCGetStarted/${vendorMailTemplateData.id}`}" style="cursor: pointer;">${CommonEmailUrl}#/app/KYCGetStarted/${vendorMailTemplateData.id}</a></p>`,
      closing: `<p class="email-paragraph">Once again, welcome aboard! We look forward to a fruitful partnership with you.</p>`,
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
  }, [vendorMailTemplateData]);

  const handleDropdownChange = (value) => {
    if
      (value === "unfilled") {
      setFilteredData(vendorCreateLinkTable.filter(row => row.sortStatus == 0));
    }
    else
      if
        (value === "save") {
        setFilteredData
          (vendorCreateLinkTable.
            filter
            (
              row =>
                row.sortStatus === 1));
      }
      else
        if
          (value === "submitted") {
          setFilteredData
            (vendorCreateLinkTable.
              filter
              (
                row =>
                  row.sortStatus === 2));
        }
  };


  return (
    <div className='vendorMainDiv'>
      <HeaderDivCommon profileImg={profileImg} loginName={loginName} logoutBtnOpen={logoutBtnOpen} logoutRef={logoutRef} handleLogout={handleLogout} logoutBtn={logoutBtn} />

      <div className='vendorLinkMainWrapper'>
        <div className="vendorCreateLinkSidebar"
          style={{ width: !sidebarExpanded ? "15.5%" : "4%", }}
        >
          <Sidebar />
        </div>
        <div className="vendorCreateLinkNewDiv"
          style={{ width: !sidebarExpanded ? "85%" : "96%" }}
        >
          <div className="Form_Container_Div DivTable">
            <div className="vendorHeading_Div">
              <span className="vendorcreateHeading">Vendor Onboarding</span>
            </div>
            <div className="vendorTable_Container_Dev">
              <div className="vendorTable_Div">
                <div className="vendorsearchbtnWrapper">
                  <div className="empShowEntriesOuterDiv">
                    <span className='empShowEntries'>Show Entries </span>
                    <select className='empShowEntriesSelect' value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value), setPageSize, gridContainerRef)}>

                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <select onChange={(e) => handleDropdownChange(e.target.value)} id='vendorselect' style={{ marginLeft: sidebarExpanded ? '46%' : "42%", width: sidebarExpanded ? '8%' : '9%' }}>
                    <option value="Select.."  ><span>Select...</span></option>
                    <option value="unfilled"><span>Unfilled</span></option>
                    <option value="save">Saved</option>
                    <option value="submitted">Submitted</option></select>
                  <div className='empSearchbtnMainDiv'>
                    <div className='vendorsearch_filter'>
                      <img src={search} alt="search" />
                      <input type="text" name="" placeholdertextsize="9px" id="vendorsearchFil" placeholder='Search' onChange={(e) => externalFilterChanged(e.target.value)} />
                    </div>
                    <div className="vendorCreate_Button_Div" onClick={handleOpenAddSuccModal}>
                      <button className="vendoropenCreateLink">Create Link</button>
                    </div>
                  </div>

                </div>
                <div className="ag-theme-alpine agTableDiv" ref={gridContainerRef} style={{ width: '100%' }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={filteredData}
                    columnDefs={[
                      {
                        headerName: 'Sr.No',
                        flex: !sidebarExpanded ? 0.4 : 0.3, valueGetter: 'node.rowIndex+1',
                        tooltipField: 'Sr.No', headerClass: 'center-header', cellStyle: { textAlign: 'right', padding: '0px 5px' },
                        cellRenderer: (params) => {
                          console.log("params", params)
                          return (
                            <p>{params?.rowIndex + 1}</p>
                          )
                        }
                      }
                      ,
                      { field: "tradeName", headerName: 'Vendor Name', flex: !sidebarExpanded ? 1.2 : 1.3, tooltipField: 'tradeName', sortable: false, },
                      { field: "contactName", headerName: 'SPOC', flex: !sidebarExpanded ? 1.2 : 1.5, tooltipField: 'contactName', sortable: false, },
                      // { field: "emailId", headerName: 'Email Id', width: '200px', tooltipField: 'emailId', sortable: true, },
                      { field: "mobileNo", headerName: 'Mobile No', flex: 1, tooltipField: 'mobileNo', sortable: false, cellStyle: { textAlign: 'right', padding: '0px 5px' } },
                      { field: "parseDate", headerName: 'Created Date', flex: !sidebarExpanded ? 1 : 0.9, tooltipField: 'parseDate', sortable: false, cellStyle: { textAlign: 'center', padding: '0px 5px' } },
                      {
                        field: "url", headerName: 'Link', flex: 1.3,
                        cellRenderer: (params) => {
                          const newBase64String = btoa(params?.data?.vendorKycId);
                          const sessionRole = sessionStorage.getItem('role');
                          let link = `${CommonUrl}#/app/KYCGetStarted/` + newBase64String;
                          let link2 = `${CommonUrl}#/app/main/KYCForm/${params?.data?.vendorKycId}`;
                          const finalLink = link;
                          return (
                            <div className='ButtonDiv' >
                              <a
                                style={{ color: params?.data?.linkColor == true ? "#9a2784" : "#4343ca" }}
                                id="elementId"
                                target="_blank"
                                href={finalLink}
                                rel="noreferrer"
                                onClick={() => {
                                  if (params?.data?.formFilled) {
                                    localStorage.setItem('ID', params?.data?.vendorKycId);
                                  } else {
                                    localStorage.removeItem('ID');
                                  }
                                  localStorage.setItem('role', sessionRole);
                                }}
                              >{finalLink}</a>
                              <div>
                                <MdContentCopy className="icons" onClick={(e) => { copyText(e); handleLinkColor(params?.data?.vendorKycId) }} />
                                {linkCopied ? <small className='copiedMessage'>Link Copied</small> : <></>}
                              </div>
                            </div>
                          )
                        },
                        tooltipField: 'url',
                      },
                      {
                        headerName: 'Filled', flex: !sidebarExpanded ? 0.9 : 0.7,sortable: true, sortingOrder: ['asc', 'desc'], field: "sortStatus", ...(isFirstRender && { sort: 'asc' })
                        ,

                        // onSortChanged: (event) => {
                        // },
                        cellRenderer: (params) => {
                          return (
                            <div className='filledButtonDiv'>
                              {params?.data?.status === true && params?.data?.formFilled == true ?
                                <BsCheckCircleFill className="icons" values={params?.data?.vendorKycId} onClick={() => navigateToPreview(params)} style={{ color: 'green' }} />
                                : params?.data?.status === false && params?.data?.formFilled == true ?
                                  <BsFillDashCircleFill className="icons" values={params?.data?.vendorKycId} onClick={() => navigateToPreview(params)} style={{ color: 'green' }} />
                                  : <></>}
                            </div>
                          )
                        },
                      },
                      { field: "filledDate", headerName: 'Filled On', flex: !sidebarExpanded ? 1 : 0.8, tooltipField: 'filledDate', sortable: true, ...(isFirstRender && { sort: 'asc' }), cellStyle: { textAlign: 'center', padding: '0px 5px' } },
                      {
                        headerName: 'Action', flex: !sidebarExpanded ? 0.9 : 0.8, marginLeft: "-10px", cellClass: "cell-border",

                        cellRenderer: (params) => {
                          return (
                            <div className="createLinkIconDiv" >
                              {
                                (rbacks?.moduleAccess && rbacks?.editAccess) &&
                                <FaRegEdit className="customerSatiscreateLinkEdit" onClick={() => handleCreateLinkEdit(params?.data)} style={{ display: params?.data?.loader ? "none" : "block" }} />
                              }

                              {
                                (rbacks?.moduleAccess && rbacks?.readAccess) &&
                                <LuEye className="customerSatiscreateLinkView" onClick={() => handleView(params?.data)} style={{ display: params?.data?.loader ? "none" : "block" }} />
                              }
                              {
                                (rbacks?.moduleAccess && rbacks?.writeAccess) &&
                                <TfiEmail
                                  className="customerSatiscreateLinkView"
                                  onClick={() => handleOpenModel(params?.data, params?.data?.linkColor)}
                                // onClick={() => handleEmailStatusCheck(params?.data, params?.data?.vendorKycId, params?.rowIndex)}
                                />
                              }

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
                  // onSortChanged={(event) => { setSortType(!sortType) }}
                  ></AgGridReact>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ReactModal isOpen={showAddSuccessModal} contentLabel="Minimal Modal Example"
        className="Modal vendormodalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseAddSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseAddSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Create Link To Start The Vendor Onboarding Process</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="vendorInput_Container_Div">
            <div className="vendorInner_Div vendorInputMainDiv">
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Vendor Name<span className='bug_star'>*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter Vendor Name"
                  />
                </div>
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>SPOC<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={contactPos} onChange={(e) => { handleContactPos(e) }} placeholder="Enter Contact Person Name" />
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Email Id<span className='bug_star'>*</span></label>
                </div>
                <input type="email" value={emailId} onChange={(e) => { handleEmailId(e) }} placeholder="Enter Email ID" />
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Mobile No<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={mobileNo} onChange={(e) => { handleMobileNo(e) }} placeholder="Enter Mobile No" maxLength={10} />
              </div>
              <div className="vendorButton_Container_Div vendorbuttonCreateLink">
                <button onClick={handleCreateLink}>Create Link</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>

      <ReactModal isOpen={showEditSuccessModal} contentLabel="Minimal Modal Example"
        className="Modal vendormodalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseEditSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseEditSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>Update The Vendor Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="vendorInput_Container_Div">
            <div className="vendorInner_Div vendorInputMainDiv">
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Vendor Name <span className='bug_star'>*</span></label>
                  <input type="text" value={name} onChange={(e) => { capitalNameCommon(e, setName, notifyAlertCharacter, capitalizeFirstLetters) }} placeholder="Enter Vendor Name" />
                </div>
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Contact Person Name<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={contactPos} onChange={(e) => { handleContactPos(e) }} placeholder="Enter Contact Person Name" />
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Email Id<span className='bug_star'>*</span></label>
                </div>
                <input type="email" value={emailId} onChange={(e) => { handleEmailId(e) }} placeholder="Enter Email ID" />
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Mobile No<span className='bug_star'>*</span></label>
                </div>
                <input type="text" value={mobileNo} onChange={(e) => { handleMobileNo(e) }} placeholder="Enter Mobile No" />
              </div>
              <div className="vendorButton_Container_Div vendorbuttonCreateLink">
                <button onClick={handleUpdateLink}>Update</button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>

      <ReactModal isOpen={showViewModal} contentLabel="Minimal Modal Example"
        className="Modal vendormodalHeightCreatLink modalRes" overlayClassName="Overlay"
        ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseViewSuccModal} >
        <div className="delete_close">
          <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseViewSuccModal} style={{ width: "30px" }} />
        </div>
        <div className="gradientDiv"></div>
        <div className="bug_modal_title">
          <label style={{ fontWeight: '700', fontSize: '15px' }}>View Vendor Details</label>
        </div>
        <div className="HeroDiv MsgDiv">
          <div className="vendorInput_Container_Div">
            <div className="vendorInner_Div vendorInputMainDiv">
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Vendor Name <span className='bug_star'>*</span></label>
                  <p className="commonPara">{name}</p>

                </div>
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Contact Person Name<span className='bug_star'>*</span></label>
                </div>
                <p className="commonPara">{contactPos}</p>

              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Email Id<span className='bug_star'>*</span></label>
                </div>
                <p className="commonPara">{emailId}</p>
              </div>
              <div className="vendorInputs vendorcreateLinkInput">
                <div className="vendorInput_Label">
                  <label>Mobile No<span className='bug_star'>*</span></label>
                </div>
                <p className="commonPara">{mobileNo}</p>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <CommonMailTemplate
        handleCloseMailModal={handleCloseMailModal}
        showMailModel={showMailModel}
        color={linkColor}
        id={vendorId}
        customerFeedbackMaster='vendorKYC'
        custFeedbackId='vendorKycId'
        url={Url.saveVendorMailData}
        subjectTitle={`Welcome to Rabbit And Tortoise Technology Solutions Vendor Network!`}
        msg={emailBody}
        mailTemplateData={vendorMailTemplateData}
        send={() => handleEmailStatusCheck(emailData)} />
      <ToastContainer rtl />

      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style1} />
      </ReactModal>
    </div>
  )
}

export default VendorKYCCreateLink