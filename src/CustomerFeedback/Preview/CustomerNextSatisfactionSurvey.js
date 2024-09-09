import { useNavigate } from 'react-router-dom';
import '../CustomerForm/CustomerSatisfactionSurvey.css';
import '../Preview/CustomerNextSatisfactionSurvey.css'
import { useEffect, useState, useContext, useRef } from 'react';
import { Url } from '../../Constants/APIUrlConstant';
import { contextData } from "../../Context/MyContext"
import Lottie from "lottie-react";
import cancel_btn from '../Assets/cancel.svg'
import ReactModal from 'react-modal';
import { PDFExport, PDFMargin } from '@progress/kendo-react-pdf'; //Changed import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../Assets/loader.json"
import feedbackImage from '../Assets/pdfHeaderbg.svg'

import Sidebar from '../../Sidebar/Sidebar';
import FeedbackQuestions from '../../CommonComponents/CommonCustomerNextSatisfaction'
import useCustomerDetails from '../../CommonComponents/CommonFielddata'
import ValidateModal from '../../CommonComponents/ValidateModal';
import DetailDivNextSatisfaction from '../../CommonComponents/CheckboxForAllPrimaryInfo';
import phone from '../Assets/phoneImg.svg'
import website from '../Assets/websiteImg.svg'
import email from '../Assets/emailImg.svg'
import CommonQuesMaster from '../../CommonComponents/CommonQuesMaster'
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../../../src/CustomerFeedback/Assets/sucess.png'
import Swal from 'sweetalert2';
import HeaderFooterTemplate from '../../CommonComponents/pdfexport/HeaderFooterTemplate';
import Commonfooterdetails from '../../CommonComponents/Commonfooterdetails';
import pdfHeader from '../../CustomerFeedback/Assets/header img.png'
import pdfTimeStamp from '../../CommonComponents/pdfTimeStamp';



const CustomerSatisfactionSurvey = () => {

  const navigate = useNavigate();
  const pdfExportComponent = useRef();
  const downloadBtnRef = useRef();
  const headerImage = useRef();
  const {
    getFormatedFileName
  } = pdfTimeStamp();

  const { sidebarExpanded, setSetsidebarExpanded, openModal } = useContext(contextData)
  const [customerFeedbackData, setCustomerFeedbackData] = useState([])
  const [showCustomerFeedback, setshowCustomerFeedback] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  console.log("selectedCheckboxes",selectedCheckboxes)
  const [showdownloadBtn, setShowdownloadBtn] = useState(false)
  const [showValidateModal, setshowValidateModal] = useState()
  const [showLoader, setShowLoader] = useState(false);
  const [pageStatus, setPageStatus] = useState('first')
  const [loginDetails, setLoginDetails] = useState({
    'Name': '',
    'companyName': '',
    'projectName': '',
    'Role': '',
    'email': '',
    'date': ''
  })
  const [selectedFields, setSelectedFields] = useState({
    name: false,
    project: false,
    role: false,
    company: false,
    email: false,
    date: false
  });
  const [selectedFieldsWithLabels, setSelectedFieldsWithLabels] = useState({});
  const [arr1, setArr1] = useState([]);
  const [arr2, setArr2] = useState([]);
  const [arr3, setArr3] = useState([]);
  const [arr4, setArr4] = useState([]);
  console.log("arr1",arr1,"arr2",arr2,"arr3",arr3,"arr4",arr4)

  const [display, setDisplay] = useState(false)

  const style1 = {
    width: "25%",
    margin: "0 auto",
  };
  const backId = btoa(sessionStorage.getItem('customerId'));
  let decodedValue = atob(sessionStorage.getItem('customerId'));

  const handleOpenCustomerfeedback = () => {
    setshowCustomerFeedback(true);
  };
  const handleCloseCustomerFeedback = () => {
    setshowCustomerFeedback(false);

  };

  const handleOpenModal = () => {
    setshowValidateModal(true);
  };
  const handleCloseValidateModal = () => {
    setshowValidateModal(false);
  };

  // useEffect(() => {
  //   setShowLoader(true)
  //   fetch(Url.questionList.replace('{formType}', 1), {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer " + sessionStorage.getItem('token'),
  //       "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
  //     }
  //   })
  //     .then((respone) => respone.json())
  //     .then((data) => {
  //       setShowLoader(false)
  //     })
  // }, [])


  useEffect(() => {
    setShowLoader(true)
    fetch(Url.getcustomerFeedbackList.replace("{id}", decodedValue), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      }
    })
      .then((respone) => respone.json())
      .then((data) => {
        setShowLoader(false)
        console.log("customer feedbackwwwwwwwwwwwwwwwwwwwwwwww", data)
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          setCustomerFeedbackData(data?.DATA)
          setSelectedCheckboxes(data?.DATA);
          data?.DATA?.map(item => {
            const id = item?.questionMaster?.questionId;
            if (id >= 1 && id <= 4) {
              setArr1(prev => [...prev, item]);
            } else if (id >= 5 && id <= 8) {
              setArr2(prev => [...prev, item]);
            } else if (id >= 9 && id <= 12) {
              setArr3(prev => [...prev, item]);
            } else {
              setArr4(prev => [...prev, item]);
            }
          })
        }
      })
  }, [])

  const handleCheckboxChange = (questionId) => {
    const id = questionId?.questionMaster?.questionId;
    const updatedCheckboxes = [...selectedCheckboxes];

    const updateArray = (array) => {
      let newArray;
      if (array.includes(questionId)) {
        newArray = array.filter(item => item !== questionId);
      } else {
        newArray = [...array, questionId];
      }
      // Sort the array based on questionMaster.questionId
      newArray.sort((a, b) => a.questionMaster.questionId - b.questionMaster.questionId);
      console.log("newArray",newArray)
      return newArray;
    };

    // Update the appropriate array state based on the question ID
    switch (true) {
      case id >= 1 && id <= 4:
        setArr1(updateArray(arr1));
        break;
      case id >= 5 && id <= 8:
        setArr2(updateArray(arr2));
        break;
      case id >= 9 && id <= 12:
        setArr3(updateArray(arr3));
        break;
      default:
        setArr4(updateArray(arr4));
    }

    if (updatedCheckboxes.includes(questionId)) {
      // Remove questionId if already present
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(questionId), 1);
    } else {
      // Add questionId if not present
      updatedCheckboxes.push(questionId);
    }
    console.log("updatedCheckboxes",updatedCheckboxes)
    updatedCheckboxes.sort((a, b) => a.questionMaster.questionId - b.questionMaster.questionId);

    setSelectedCheckboxes(updatedCheckboxes);
  };

  const handleSelectAll = () => {
    const allQuestionIds = customerFeedbackData?.map((item) => item);
    allQuestionIds.sort((a, b) => a.questionMaster.questionId - b.questionMaster.questionId);
    setSelectedCheckboxes(allQuestionIds);

    customerFeedbackData?.forEach(item => {
      const id = item?.questionMaster?.questionId;
      if (id >= 1 && id <= 4) {
        setArr1(prev => [...prev, item]);
      } else if (id >= 5 && id <= 8) {
        setArr2(prev => [...prev, item]);
      } else if (id >= 9 && id <= 12) {
        setArr3(prev => [...prev, item]);
      } else {
        setArr4(prev => [...prev, item]);
      }
    })

  };

  const handleDeselectAll = () => {
    setSelectedCheckboxes([]);
  };

  const areAllSelected = selectedCheckboxes?.length === customerFeedbackData?.length;

  const isCheckboxSelected = (questionId) => {
    return selectedCheckboxes.includes(questionId);
  };

  const toggleSelectAll = () => {
    console.log("areAllSelected",areAllSelected)
    if (areAllSelected) {
      setArr1([])
      setArr2([])
      setArr3([])
      setArr4([])
      handleDeselectAll();
    } else {    
      setArr1([])
      setArr2([])
      setArr3([])
      setArr4([])
      handleSelectAll();
    }
  };

  const handlePreview = () => {
    if (selectedCheckboxes?.length == 0 || Object.keys(selectedFieldsWithLabels)?.length === 0) {
      handleOpenModal();
    }
    else {
      handleOpenCustomerfeedback()
    }
  }

  const notify = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
    );
    Swal.fire({
      title: 'PDF Downloaded Successfully',
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

  const handleDownload = () => {
    setSetsidebarExpanded(true)
    downloadBtnRef.current.style.display = 'none';
    headerImage.current.style.display = 'none';
    // customFooter.current.style.display = "block"
    setDisplay(true)


    notify();
    setShowdownloadBtn(true)
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(getFormatedFileName(`Project_End_Feedback for ${loginDetails.projectName}+'.pdf'`));

      setTimeout(() => {
        downloadBtnRef.current.style.display = 'inline-block;';
        headerImage.current.style.display = 'block';
        // customFooter.current.style.display = "none"
        setDisplay(false)
      }, 50);

    }
  }

  useCustomerDetails(Url, decodedValue, setShowLoader, setLoginDetails, loginDetails);
  let
    pdfString
      =
      "Project End Feedback   "
  let pdfStringName = loginDetails.projectName
  return (
    <>
      <div className='customernextWrapper'>
        <div className='customerNextSidebar' style={{ width: !sidebarExpanded ? "17%" : "4%", marginTop: !sidebarExpanded ? "-25px" : "-14px" }}>
          <Sidebar />
        </div>
        <div className='customerNextNewDiv' style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
          <div className='customerNextdataDiv'>
            <div className={`outerDiv`}>
              <DetailDivNextSatisfaction
                loginDetails={loginDetails}
                setSelectedFields={setSelectedFields}
                selectedFields={selectedFields}
                setSelectedFieldsWithLabels={setSelectedFieldsWithLabels}
                selectedFieldsWithLabels={selectedFieldsWithLabels}
                label1='Project'
                label2='Name'
                label3={loginDetails.Role ? 'Role' : null}
                label4='Company'
                label5='Email'
                label6='Filled On'
                value1={loginDetails.projectName}
                value2={loginDetails.Name}
                value3={loginDetails.Role || ''}
                value4={loginDetails.companyName}
                value5={loginDetails.email}
                value6={loginDetails.date}
              />
            </div>
          </div>
          <div className='customerNextdataDiv'>
            <div className={`MainouterDiv ${pageStatus == "first" ? "" : "hideDiv"}`}>
              <div>
                <div className='mainHeaderDiv'>

                  <input
                    type="checkbox"
                    id="selectAllCheckbox"
                    checked={areAllSelected}
                    onChange={toggleSelectAll}
                  />
                  <label htmlFor="selectAllCheckbox">Select All</label>
                </div>
                <div>
                </div>
                {customerFeedbackData?.map((item) => (
                  <div className='CustomerFeedmainContentDiv' key={item.questionMaster.questionId}>
                    <div className='customerFeedbackquestionDiv'>
                      <input style={{ marginRight: '10px', marginTop: '4px' }}
                        type="checkbox"
                        id={`checkbox-${item.questionId}`}
                        checked={isCheckboxSelected(item)}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <span className='customerFeedbackQuestionDetail'>Question</span>
                      <span className='custFeedQuesSemi'>:</span>
                      <span className='questionDetails2'>
                        {item?.questionMaster?.question}</span>
                    </div>
                    <div className='custNextanswerDivNext'>
                      <span className='custfeedAns' style={{ marginLeft: !sidebarExpanded ? "-6px" : "" }}>Response</span>
                      <span className='customerNextcolon' style={{ marginLeft: "20px" }}>:</span>

                      <CommonQuesMaster item={item} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='mainButtonDiv1'>
              <button onClick={() => { pageStatus == "first" ? navigate(`/app/main/FilledFeedbackForm/${backId}`) : setPageStatus('first') }} className='backBtn'>Back</button>
              <div className='btnDownload'>
                <button onClick={handlePreview}>View Preview</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ReactModal
        isOpen={showCustomerFeedback}
        contentLabel="Minimal Modal Example"
        className="CustomerfeedbackModal customerFeedbackModalHeightBug "
        overlayClassName="Overlay"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleCloseCustomerFeedback}
      >
        <div className="delete_close_one">
          <img
            src={cancel_btn}
            alt="cancel-btn"
            onClick={handleCloseCustomerFeedback}
            style={{ width: "30px" }}
          ></img>
        </div>
        <div>
          <div className='pdfImageDiv' ref={headerImage}>
            <img src={pdfHeader} alt='header' style={{ width: '100%' }} />

          </div>
          <PDFExport
            ref={pdfExportComponent}
            pageTemplate={HeaderFooterTemplate}
            forcePageBreak=".page-break" 
            keepTogether='.together'
            paperSize="A4"
            margin={{ top: ' 0cm', left: 0, right: 0, bottom: '3cm' }}
            author="KendoReact Team"
            fileName={getFormatedFileName(`Project_End_Feedback_for_${loginDetails.projectName}`) + '.pdf'}           >
            <PDFMargin top="17mm" bottom="15mm" />


            <div className={showdownloadBtn ? '' : 'pdfquestionsPdfDiv'} style={{ position: 'relative', zIndex: "200" }}>
              <div style={{ paddingLeft: "15px" }}>

                <div >
                  <div style={{ fontWeight: "700", fontSize: "14px", textAlign: "center", marginTop: "-2px" }} > {pdfString}</div>
                  {/* <div style={{fontSize:"13px",fontWeight:"600",marginTop:"9px"}}>Project Name-{pdfStringName}</div> */}
                </div>
              </div>
              <div className={showdownloadBtn ? 'pdfcustomerFeedDetailDiv1' : 'pdfcustomerFeedDetailDiv'}>
                <table>
                  {Object.entries(selectedFieldsWithLabels).map(([label, value], index) => (
                    <tr key={label}>
                      <td>
                        <div className='pdfinformationDiv1'>
                          <div className='pdfinformationDiv1Label'>
                            <span className='label1' style={{ fontWeight: "bold" }} >{label}</span>
                            <span className=''>:</span>
                          </div>
                          <div className='pdfcontentDetails'>{value}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
              {areAllSelected && (
                <div>
                  <div className='pdfcustomerNextouterDiv' >
                    <div className='pdfmainHeaderDiv1'>
                      <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Project Management & Execution</h1>
                    </div>
                    {selectedCheckboxes?.slice(0, 4).map((question, index) => (
                      <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                    ))
                    }
                  </div>
                  <div className='pdfcustomerNextouterDiv' >
                    <div className='pdfmainHeaderDiv1'>
                      <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Quality of Deliverables</h1>
                    </div>
                    {selectedCheckboxes?.slice(4, 8).map((question, index) => (
                      <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                    ))}
                  </div>
                  <div className='pdfcustomerNextouterDiv' >
                    <div className='pdfmainHeaderDiv1'>
                      <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Team Competence</h1>
                    </div>
                    {selectedCheckboxes?.slice(8, 12).map((question, index) => (
                      <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                    ))}
                  </div>
                  <div className='pdfcustomerNextouterDiv pdfPageBreak' >
                    <div className='pdfmainHeaderDiv1'>
                      <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}> Overall</h1>
                    </div>
                    {selectedCheckboxes?.slice(12, 13).map((question, index) => (
                      <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                    ))}
                  </div>
                </div>
              )}
              {arr1?.length > 0 && !areAllSelected && (
                <div className='pdfcustomerNextouterDiv' >
                  <div className='pdfmainHeaderDiv1'>
                    <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Project Management & Execution</h1>
                  </div>
                  {arr1?.map((question, index) => (
                    <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                  ))
                  }
                </div>
              )}
              {arr2?.length > 0 && !areAllSelected && (
                <div className='pdfcustomerNextouterDiv' >
                  <div className='pdfmainHeaderDiv1'>
                    <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Quality of Deliverables</h1>
                  </div>
                  {arr2?.map((question, index) => (
                    <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                  ))}
                </div>
              )}
              {arr3?.length > 0 && !areAllSelected && (
                <div className='pdfcustomerNextouterDiv' >
                  <div className='pdfmainHeaderDiv1'>
                    <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Team Competence</h1>
                  </div>
                  {arr3?.map((question, index) => (
                    <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                  ))}
                </div>
              )}
              {arr4?.length > 0 && !areAllSelected && (
                <div className='pdfcustomerNextouterDiv' >
                  <div className='pdfmainHeaderDiv1'>
                    <h1 className={showdownloadBtn ? 'pdfheader1' : 'pdfheader'}>Overall</h1>
                  </div>
                  {arr4?.map((question, index) => (
                    <FeedbackQuestions key={question?.questionMaster?.questionId} showdownloadBtn={showdownloadBtn} question={question} index={index} needPadding={true} />
                  ))}
                </div>
              )}
            </div>
          </PDFExport>
          <div className='pdfCustomerFeedbackbuttonDivDele' ref={downloadBtnRef}>
            <button onClick={handleDownload} className="pdfCustomerFeedbackDeleteClose">
              Download PDF
            </button>
          </div>
          <Commonfooterdetails />
          <ToastContainer rtl />
        </div>

      </ReactModal>
      <ValidateModal
        isOpen={showValidateModal}
        onRequestClose={handleCloseValidateModal}
        selectedFieldsWithLabels={selectedFieldsWithLabels}
        selectedCheckboxes={selectedCheckboxes}
      />
      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style1} />
      </ReactModal>
    </>

  );
}

export default CustomerSatisfactionSurvey;
