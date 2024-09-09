import React, { useEffect, useState, useContext, useRef } from 'react';
import './EmployeeDownloadView.css'
import { Url } from '../../Constants/APIUrlConstant';
import { contextData } from "../../Context/MyContext"
import Lottie from "lottie-react";
import cancel_btn from '../../CustomerFeedback/Assets/cancel.svg'
import ReactModal from 'react-modal';
import CommonQuesMaster from '../../CommonComponents/CommonQuesMaster'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../CustomerFeedback/Assets/loader.json"
import feedbackImage from '../../CustomerFeedback/Assets/pdfHeaderbg.svg'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar/Sidebar';
import FeedbackQuestions from '../../CommonComponents/CommonCustomerNextSatisfaction'
import endImage from '../../CustomerFeedback/Assets/pdffooterNew.png'
import CommonEmployeefelid from '../../CommonComponents/CommonEmployeefelid'
import CommonEmplDownView from '../../CommonComponents/CommonEmplDownView';
import CheckboxHandler from '../../CommonComponents/CheckboxHandler';
import ValidateModal from '../../CommonComponents/ValidateModal';
import DetailDivNextSatisfaction from '../../CommonComponents/CheckboxForAllPrimaryInfo';
import phone from '../../CustomerFeedback/Assets/phoneImg.svg'
import website from '../../CustomerFeedback/Assets/websiteImg.svg'
import email from '../../CustomerFeedback/Assets/emailImg.svg'
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../../../src/CustomerFeedback/Assets/sucess.png'
import Swal from 'sweetalert2';
import { PDFExport, PDFMargin } from '@progress/kendo-react-pdf';
import HeaderFooterTemplate from './../../CommonComponents/pdfexport/HeaderFooterTemplate';
import Commonfooterdetails from '../../CommonComponents/Commonfooterdetails';
import pdfHeader from '../../CustomerFeedback/Assets/header img.png'
import pdfTimeStamp from '../../CommonComponents/pdfTimeStamp';


export const Privew = ({ handlePreview }) => {
    return <div className='EmployeeDownloadbtnDownload'>
        <button onClick={handlePreview}>View Preview</button>
    </div>
}

const EmployeeDownloadView = () => {
    const {
        getFormatedFileName
    } = pdfTimeStamp();
    const [, setQuetionList] = useState([])
    const [customerFeedbackData, setCustomerFeedbackData] = useState([])
    const navigate = useNavigate();
    const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
    const [showCustomerFeedback, setshowCustomerFeedback] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [showdownloadBtn, setShowdownloadBtn] = useState(false)
    const pdfExportComponent = useRef();
    const downloadBtnRef = useRef();
    const headerImage = useRef();
    // const customFooter = useRef();
    const [, setShow] = useState(false)
    const [showValidateModal, setshowValidateModal] = useState()
    const [showLoader, setShowLoader] = useState(false);
    const [array, setArray] = useState([])
    const [loginDetails, setLoginDetails] = useState({
        'name': '',
        'projectName': '',
        'projectManager': '',
        'email': '',
        'date': ''
    })

    const [selectedFields2, setSelectedFields2] = useState({
        name: false,
        projectName: false,
        projectManager: false,
        email: false,
        date: false
    });

    const [display, setDisplay] = useState(false)

    const [selectedFieldsWithLabels2, setSelectedFieldsWithLabels2] = useState({});
    const { sidebarExpanded, openModal } = useContext(contextData)
    const style1 = {
        width: "25%",
        margin: "0 auto",
    };

    let EmployeeID = btoa(sessionStorage.getItem('employeeID'));


    const handleOpenCustomerfeedback = () => {
        setshowCustomerFeedback(true);
    };
    const handleCloseCustomerFeedback = () => {
        setshowCustomerFeedback(false);
        setShow(true)
        // setArray([])
    };

    const handleOpenModal = () => {
        setshowValidateModal(true);
    };
    const handleCloseValidateModal = () => {
        setshowValidateModal(false);
    };
    const style = {
        width: "25%",
        margin: "0 auto",
    };
    const idRange = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];


    useEffect(() => {
        setShowLoader(true)
        fetch(Url.questionList.replace("{formType}", 3), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
            }
        })
            .then((respone) => respone.json())
            .then((data) => {
                console.log("API==", Url.questionList?.replace("{formType}", 3), "Result", data);
                setShowLoader(false)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    setQuetionList(data.DATA)
                }
            }).catch((error) => {
                console.log("thenCatchError", error)
            })
    }, [])

    let decodedValue = atob(sessionStorage.getItem('employeeID'));

    useEffect(() => {
        setShowLoader(true)
        fetch(Url.getSubmittedEmployeeFeedback.replace("{id}", decodedValue), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
            }
        })
            .then((respone) => respone.json())
            .then((data) => {
                console.log("API==", Url.getSubmittedEmployeeFeedback.replace("{id}", decodedValue), "Result", data);
                setShowLoader(false)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    setCustomerFeedbackData(data?.DATA)
                    setSelectedCheckboxes(data?.DATA);
                    setArray(data?.DATA)
                }
            }).catch((error) => {
                console.log("thenCatchError", error)
            })
    }, [])
    const [pageStatus] = useState('first')
    const [errorShow] = useState(false)


    const handleSelectAll = () => {
        const allQuestionIds = customerFeedbackData?.map((item) => item);
        setSelectedCheckboxes(allQuestionIds);
        setArray(allQuestionIds);
    };

    const handleDeselectAll = () => {
        setArray([])
        setSelectedCheckboxes([]);
    };

    // const isCheckboxSelected = (questionId) => {
    //     return selectedCheckboxes.includes(questionId);
    // };

    const areAllSelected = selectedCheckboxes?.length === customerFeedbackData?.length;

    const toggleSelectAll = () => {
        if (areAllSelected) {
            handleDeselectAll();
        } else {
            handleSelectAll();
        }
    };

    const handlePreview = () => {
        setShow(true)
        if (selectedCheckboxes?.length == 0 || Object.keys(selectedFieldsWithLabels2)?.length === 0) {
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
        downloadBtnRef.current.style.display = 'none';
        headerImage.current.style.display = 'none';
        // customFooter.current.style.display = "block"
        setDisplay(true)

        if (pdfExportComponent.current) {
            pdfExportComponent.current.save(`Employee_Feedback.pdf for ${loginDetails.name}`);
            notify();
            setTimeout(() => {
                downloadBtnRef.current.style.display = 'inline-block;';
                headerImage.current.style.display = 'block';
                // customFooter.current.style.display = "none"
                setDisplay(false)
            }, 50);

        }
    }

    const decode = atob(sessionStorage.getItem('employeeID'));
    CommonEmployeefelid(Url, decode, setShowLoader, setLoginDetails, loginDetails);

    const headers = {
        21: "Communication Skills",
        22: "Job Knowledge",
        23: "Quality of Work",
        24: "Teamwork",
        25: "Problem-solving Skills",
        26: "Initiative and Proactivity",
        27: "Dependability and Reliability",
        28: "Adaptability",
        29: "Leadership Potential (if applicable)",
        30: "Comments",
        31: "Overall Performance Rating",
        32: "Additional Feedback"
    };
    let
        pdfString
            =
            "Employee Feedback "
    let pdStringName = loginDetails.name
    return (
        <>
            <div className='EmployeeDownloadnextWrapper'>
                <div className='EmployeeDownloadNextSidebar' style={{ width: !sidebarExpanded ? "17%" : "4%", marginTop: !sidebarExpanded ? "-28px" : "-16px" }}>
                    <Sidebar />
                </div>
                <div className='EmployeeDownloadNextNewDiv' style={{ width: !sidebarExpanded ? "100%" : "96%", }}>
                    <div className='EmployeeDownloadNextdataDiv'>
                        <div className={`outerDiv`}>
                            <DetailDivNextSatisfaction
                                loginDetails={loginDetails}
                                setSelectedFields={setSelectedFields2}
                                selectedFields={selectedFields2}
                                setSelectedFieldsWithLabels={setSelectedFieldsWithLabels2}
                                selectedFieldsWithLabels={selectedFieldsWithLabels2}
                                label1='Employee Name'
                                label2='Project Name'
                                label4='Project Manager'
                                label5='Email ID'
                                label3='Filled On'
                                value1={loginDetails.name}
                                value2={loginDetails.projectName}
                                value4={loginDetails.projectManager}
                                value5={loginDetails.email}
                                value3={loginDetails.date}
                                field1={selectedFields2.name}
                                field2={selectedFields2.projectName}
                                field4={selectedFields2.projectManager}
                                field5={selectedFields2.email}
                                field3={selectedFields2.date}
                            />
                        </div>
                    </div>
                    <div className='EmployeeDownloadNextdataDiv'>
                        <div className={`EmployeeDownloadMainouterDiv ${pageStatus == "first" ? "" : "hideDiv"}`}>
                            <div>
                                <div className='EmployeeDownloadmainHeaderDiv'>

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
                                {customerFeedbackData?.map((item, i) => (
                                    <div className='EmployeeDownloadCustomerFeedmainContentDiv' key={item.questionId}>
                                        <div className='EmployeeDownloadcustomerFeedbackquestionDiv'>
                                            <CheckboxHandler question={item} idRange={idRange} selectedCheckboxes={selectedCheckboxes} setSelectedCheckboxes={setSelectedCheckboxes} array={array} setArray={setArray} />
                                            <span className='EmployeeDownloadcustomerFeedbackQuestionDetail' style={{ marginLeft: !sidebarExpanded ? "10px" : "" }}>Question</span>
                                            <span className='EmployeeDownloadcustFeedQuesSemi ' style={{ marginLeft: !sidebarExpanded ? "-5px" : "" }}>:</span>
                                            <span className='EmployeeDownloadquestionDetails1'>
                                                {item?.questionMaster?.question}</span>
                                        </div>
                                        <div className='EmployeeDownloadcustNextanswerDivNext'>
                                            <span className='EmployeeDownloadcustfeedAns'>Response</span>
                                            <span className='EmployeeDownloadscustomerNextcolon' style={{ marginLeft: !sidebarExpanded ? "16px" : "22px" }}>:</span>
                                            <CommonQuesMaster item={item} />

                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>
                        <div className='EmployeeDownloadmainButtonDiv1'>
                            <button onClick={() => { navigate(`/app/main/EmployeeFilledFeedback/${EmployeeID}`) }} className='EmployeeDownloadbackBtn'>Back</button>

                            <Privew handlePreview={handlePreview} />
                        </div>

                    </div>
                </div>
            </div>

            <CommonEmplDownView showAddSuccessModal={showAddSuccessModal} setshowAddSuccessModal={setshowAddSuccessModal} errorShow={errorShow} />
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

                    <div className='EmployeeDownloadpdfImageDiv' ref={headerImage}>
                        <img src={pdfHeader} alt='header' style={{ width: '100%' }} />
                    </div>


                    <PDFExport
                        ref={pdfExportComponent}
                        pageTemplate={HeaderFooterTemplate}
                        forcePageBreak=".page-break" keepTogether='.together'
                        paperSize="A4"
                        margin={{ top: ' 1cm', left: 0, right: 0, bottom: '3cm' }}
                        author="KendoReact Team"
                        fileName={getFormatedFileName(`Employee_Feedback ${loginDetails.name}`)+'.pdf'}
                    >
                        <PDFMargin top="17mm" bottom="15mm" />

                        <div className={showdownloadBtn ? '' : 'pdfquestionsPdfDiv'} style={{ position: 'relative', zIndex: "200" }}>
                            <div style={{ paddingLeft: "15px" }}>

                                <div >
                                    <div style={{ fontWeight: "700", fontSize: "15px", textAlign: "center" }} > {pdfString}</div>
                                    {/* <span style={{fontSize:"13px",fontWeight:"600",marginTop:"10px"}}>Employee Name-{pdStringName}</span> */}
                                </div>
                            </div>

                            <div className={showdownloadBtn ? 'pdfEmployeeDownloadFeedDetailDiv1' : 'pdfEmployeeDownloadFeedDetailDiv'}>
                                <table>
                                    {Object.entries(selectedFieldsWithLabels2).map(([label, value], index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className='pdfinformationDiv1' style={{marginBottom:"0px"}}>
                                                    <div className='pdfinformationDiv1Label4'>
                                                        <span className='label1' style={{ fontWeight: "bold" }} >{label}</span>
                                                        <span >:</span>
                                                    </div>
                                                    <div className='pdfcontentDetails'>{value}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            </div>

                            {
                                array?.map((question, index) => {
                                    const header = headers[question?.questionMaster?.questionId];
                                    if (header) {
                                        return (
                                            <div className='EmployeeDownloadpdfcustomerNextouterDiv' key={question?.questionMaster?.questionId}>
                                                <div className='EmployeeDownloadpdfmainHeaderDiv1'>
                                                    <h1 className={showdownloadBtn ? 'EmployeeDownloadpdfheader1' : 'EmployeeDownloadpdfheader'}>{header}</h1>
                                                </div>
                                                <FeedbackQuestions
                                                    key={question?.questionMaster?.questionId}
                                                    showdownloadBtn={showdownloadBtn}
                                                    question={question}
                                                    index={index}
                                                />
                                            </div>
                                        );
                                    }
                                })
                            }

                            <div className={showdownloadBtn ? 'EmployeeDownloadpdfhidedownloadBtn' : 'pdfEmployeeDownloadFeedbackbuttonDivDele'} ref={downloadBtnRef} >
                                <button onClick={handleDownload} className="pdfEmployeeDownFeedbackDeleteClose">
                                    Download PDF
                                </button>
                            </div>

                        </div>
                    </PDFExport>
                    <Commonfooterdetails />

                    <ToastContainer rtl />

                </div>

            </ReactModal>
            <ValidateModal
                isOpen={showValidateModal}
                onRequestClose={handleCloseValidateModal}
                selectedFieldsWithLabels={selectedFieldsWithLabels2}
                selectedCheckboxes={selectedCheckboxes}
            />
            <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
                overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
                <Lottie animationData={Loader} style={style1} />
            </ReactModal>
        </>
    )
}

export default EmployeeDownloadView