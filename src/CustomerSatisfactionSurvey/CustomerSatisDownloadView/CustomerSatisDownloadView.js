import React, { useEffect, useRef, useState, useContext } from 'react'
import { Url } from '../../Constants/APIUrlConstant';
import './CustomerSatisDownloadView.css';
import Lottie from "lottie-react";
import Loader from "../../CustomerFeedback/Assets/loader.json"
import ReactModal from 'react-modal';
import { PDFExport, PDFMargin } from '@progress/kendo-react-pdf'; //Changed import
import { useNavigate } from 'react-router-dom';
import cancel_btn from '../../CustomerFeedback/Assets/cancel.svg'
import { ToastContainer } from 'react-toastify';
import Sidebar from '../../Sidebar/Sidebar';
import feedbackImage from '../../CustomerFeedback/Assets/header img.png'
import endImage from '../../CustomerFeedback/Assets/pdffooterNew.png'
import { contextData } from '../../Context/MyContext';
import FeedbackQuestions from '../../CommonComponents/CommonCustomerNextSatisfaction'
import useCustomerDetailsData from '../../CommonComponents/CommoncustomersatifelidData'
import CommonEmplDownView from '../../CommonComponents/CommonEmplDownView';
import CheckboxHandler from '../../CommonComponents/CheckboxHandler'
import ValidateModal from '../../CommonComponents/ValidateModal';
import DetailDivNextSatisfaction from '../../CommonComponents/CheckboxForAllPrimaryInfo';
import phone from '../../CustomerFeedback/Assets/phoneImg.svg'
import website from '../../CustomerFeedback/Assets/websiteImg.svg'
import email from '../../CustomerFeedback/Assets/emailImg.svg'
import CommonQuesMaster from '../../CommonComponents/CommonQuesMaster'
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../../../src/CustomerFeedback/Assets/sucess.png'
import Swal from 'sweetalert2';
import HeaderFooterTemplate from './../../CommonComponents/pdfexport/HeaderFooterTemplate';
import Commonfooterdetails from '../../CommonComponents/Commonfooterdetails';
import pdfTimeStamp from '../../CommonComponents/pdfTimeStamp';

export const Privewdown = ({ handlePreview }) => {
    return <div className='EmployeeDownloadbtnDownload'>
        <button onClick={handlePreview}>View Preview</button>
    </div>
}


const CustomerSatisDownloadView = () => {
    const { sidebarExpanded, openModal } = useContext(contextData)

    const pdfExportComponent = useRef();
    const downloadBtnRef = useRef();
    const headerImage = useRef();
    // const customFooter = useRef();

    const navigate = useNavigate();
    const {
        getFormatedFileName
    } = pdfTimeStamp();
    const [showLoader, setShowLoader] = useState(false);
    const [showdownloadBtn, setShowdownloadBtn] = useState(false)
    const [showValidateModal, setshowValidateModal] = useState()
    const [pageStatus] = useState('first')
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [customerFeedbackData, setCustomerFeedbackData] = useState([])
    const [showCustomerFeedback, setshowCustomerFeedback] = useState(false);
    const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
    const [errorShow] = useState(false)
    const [array, setArray] = useState([])
    const [loginDetails, setLoginDetails] = useState({
        'Name': '',
        'companyName': '',
        'projectName': '',
        'Role': '',
        'EmailID': '',
        "MobileNo": '',
        'date': ''
    })
    const [display, setDisplay] = useState(false)


    const style1 = {
        width: "25%",
        margin: "0 auto",
    };

    let decode = atob(sessionStorage.getItem('SatisfactionId'))
    useEffect(() => {
        setShowLoader(true)
        fetch(Url.getSubmitData.replace('{id}', decode), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
            }
        })
            .then((respone) => respone.json())
            .then((data) => {
                setShowLoader(false)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    setCustomerFeedbackData(data?.DATA)
                    setSelectedCheckboxes(data?.DATA);
                    setArray(data?.DATA)
                }
            })
    }, [])
    let backID = btoa(sessionStorage.getItem('SatisfactionId'))

    const handleCloseValidateModal = () => {
        setshowValidateModal(false);
    };

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

    let decodedValue = atob(sessionStorage.getItem('SatisfactionId'));
    useCustomerDetailsData(Url, decodedValue, setShowLoader, setLoginDetails, loginDetails)

    const handleDownload = () => {
        setDisplay(true)

        downloadBtnRef.current.style.display = 'none';
        headerImage.current.style.display = 'none';
        // customFooter.current.style.display = "block"

        notify();
        setShowdownloadBtn(true)
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();

            setTimeout(() => {
                downloadBtnRef.current.style.display = 'inline-block;';
                headerImage.current.style.display = 'block';
                // customFooter.current.style.display = "none"
                setDisplay(false)
            }, 50);
        }
        setDisplay(false)
    }


    const idRange = [14, 15, 16, 17, 18, 19, 20];

    const areAllSelected = selectedCheckboxes?.length === customerFeedbackData?.length;

    const toggleSelectAll = () => {
        if (areAllSelected) {
            handleDeselectAll();
        } else {
            handleSelectAll();
        }
    };

    const handleSelectAll = () => {
        const allQuestionIds = customerFeedbackData?.map((item) => item);
        setSelectedCheckboxes(allQuestionIds);
        setArray(allQuestionIds);
    };

    const handleDeselectAll = () => {
        setArray([])
        setSelectedCheckboxes([]);
    };

    const handlePreview = () => {
        if (selectedCheckboxes?.length == 0 || Object.keys(selectedFieldsWithLabels1)?.length === 0) {
            handleOpenModal();
        }
        else {
            handleOpenCustomerfeedback()
        }

    }

    const handleOpenModal = () => {
        setshowValidateModal(true);
    };

    const handleOpenCustomerfeedback = () => {
        setshowCustomerFeedback(true);
    };
    const handleCloseCustomerFeedback = () => {
        setshowCustomerFeedback(false);
        // setArray([])
    };

    const initialSelectedFields = {
        field1: true,
        field2: true,
        field3: true,
        field4: true,
        field5: true,
        field6: true,
    };

    const initialSelectedFieldsWithLabels = {
        'Name': loginDetails.Name,
        'Mobile': loginDetails.MobileNo,
        'Company': loginDetails.companyName,
        'Email': loginDetails.EmailID,
        'Filled On': loginDetails.date,
    };
    const [selectedFields1, setSelectedFields1] = useState(initialSelectedFields);
    const [selectedFieldsWithLabels1, setSelectedFieldsWithLabels1] = useState(initialSelectedFieldsWithLabels);

    const titles = {
        14: "Timeliness of Service Delivery",
        15: "Quality of Service Provided",
        16: "Communication with Our Team",
        17: "Resolution of Issues",
        18: "Professionalism of Our Team",
        19: "Overall Satisfaction",
        20: "Comments",
    };

    return (
        <div>
            <div className='customerSatisDownloadViewWrapper'>
                <div className='customerSatisDownloadViewSidebar' style={{ width: !sidebarExpanded ? "17%" : "4%", marginTop: !sidebarExpanded ? "" : "17px" }}>
                    <Sidebar />
                </div>
                <div className='customerSatisDownloadViewNewDiv' style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
                    <div className='customerSatisDownloadViewdataDiv'>
                        <div className={`customerSatisDownloadViewouterDiv`}>
                            <DetailDivNextSatisfaction
                                loginDetails={loginDetails}
                                setSelectedFields={setSelectedFields1}
                                selectedFields={selectedFields1}
                                setSelectedFieldsWithLabels={setSelectedFieldsWithLabels1}
                                selectedFieldsWithLabels={selectedFieldsWithLabels1}
                                label1='Name'
                                label2={loginDetails?.MobileNo ? 'Mobile' : null}
                                label4='Company'
                                label5='Email'
                                label3='Filled On'
                                value1={loginDetails.Name}
                                value2={loginDetails.MobileNo || ''}
                                value4={loginDetails.companyName}
                                value5={loginDetails.EmailID}
                                value3={loginDetails.date}
                                field1={selectedFields1?.field1}
                                field2={selectedFields1?.field2}
                                field4={selectedFields1?.field4}
                                field5={selectedFields1?.field5}
                                field3={selectedFields1?.field3}
                            />
                        </div>
                    </div>
                    <div className={`DownloadViewMainouterDiv 
    ${pageStatus === "first" ? "" : "hideDiv"} 
    ${!loginDetails?.MobileNo ? 'defaultHeight' : 'regularHeight'}`}
>
                        <div>
                            <div className='DownloadViewmainHeaderDiv'>

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
                                <div className='mainContentDiv' key={item.questionId}>
                                    <div className='DownloadViewcustomerFeedbackquestionDiv'>
                                        <CheckboxHandler question={item} idRange={idRange} selectedCheckboxes={selectedCheckboxes} setSelectedCheckboxes={setSelectedCheckboxes} array={array} setArray={setArray} />
                                        <span className='DownloadViewcustomerFeedbackQuestionDetail' style={{ marginLeft: !sidebarExpanded ? "7px" : "" }}>Question</span>
                                        <span className='DownloadViewcustFeedQuesSemi' style={{ marginLeft: !sidebarExpanded ? "-1px" : "" }}>:</span>
                                        <span className='DownloadViewquestionDetails1'>
                                            {item?.questionMaster?.question}</span>
                                    </div>
                                    <div className='DownloadViewcustNextanswerDivNext'>
                                        <span className='DownloadViewcustfeedAns' >Response</span>
                                        <span className='DownloadViewcustomerNextcolon' style={{ position: "relative", left: "9px", marginLeft: !sidebarExpanded ? "7px" : "11px" }}>:</span>
                                        <CommonQuesMaster item={item} />

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='DownloadViewmainButtonDiv1'>
                        <button onClick={() => { navigate(`/app/main/CSFilledFeedbackForm/${backID}`) }} className='DownloadViewBackbtn'>Back</button>
                        <Privewdown handlePreview={handlePreview} />
                    </div>
                </div>
            </div>

            <CommonEmplDownView showAddSuccessModal={showAddSuccessModal} setshowAddSuccessModal={setshowAddSuccessModal} errorShow={errorShow} />
            <ReactModal
                isOpen={showCustomerFeedback}
                contentLabel="Minimal Modal Example"
                className="DownloadViewCustomerfeedbackModal DownloadViewcustomerFeedbackModalHeightBug "
                overlayClassName="Overlay"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={false}
                onRequestClose={handleCloseCustomerFeedback}
            >
                <div className="DownloadViewdelete_close_one">
                    <img
                        src={cancel_btn}
                        alt="cancel-btn"
                        onClick={handleCloseCustomerFeedback}
                        style={{ width: "30px" }}
                    ></img>
                </div>
                <div>
                    <div className='EmployeeDownloadpdfImageDiv' ref={headerImage}>
                        <img src={feedbackImage} alt='feedback' className='EmployeeDownloadpdfImage' />
                    </div>

                    <PDFExport
                        ref={pdfExportComponent}
                        pageTemplate={HeaderFooterTemplate}
                        forcePageBreak=".page-break" keepTogether='.together'
                        paperSize="A4"
                        margin={{ top: ' 1cm', left: 0, right: 0, bottom: '3cm' }}
                        author="KendoReact Team"
                        fileName={getFormatedFileName(`Customer Satisfaction Survey`) + '.pdf'}

                    >
                        <PDFMargin top="15mm" bottom="10mm" />

                        {/* <div className='customerSatisDownloadViewpdfImageDiv'>
                            <img src={feedbackImage} alt='feedbackimage' className='customerSatisDownloadViewpdfImage' />
                        </div> */}
                        <div className={showdownloadBtn ? '' : 'DownloadViewpdfquestionsPdfDiv'}>
                            <div>
                                <h2 className={showdownloadBtn ? 'DownloadViewpdfProjectEndHeader1' : 'DownloadViewpdfProjectEndHeader'}>Customer Satisfaction Survey</h2>
                            </div>

                            <div className={showdownloadBtn ? 'DownloadViewpdfcustomerFeedDetailDiv1' : 'DownloadViewpdfcustomerFeedDetailDiv'}>
                                <table>
                                    {Object.entries(selectedFieldsWithLabels1).map(([label, value], index) => (
                                        <tr key={label}>
                                            <td>
                                                <div className='pdfinformationDiv1' style={{ padding: '0px 3px' }}>
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


                            {array.map((item, index) => {
                                const title = titles[item.questionMaster.questionId];
                                if (title) {
                                    return (
                                        <div className='DownloadViewpdfcustomerNextouterDiv' key={item.id}>
                                            <div className='DownloadViewpdfmainHeaderDiv1'>
                                                <h1 className={showdownloadBtn ? 'DownloadViewpdfheader1' : 'DownloadViewpdfheader'}>{title}</h1>
                                            </div>
                                            <FeedbackQuestions key={item?.questionMaster?.question} showdownloadBtn={showdownloadBtn} question={item} index={index} needPadding={true} />
                                        </div>
                                    );
                                }
                                return null;
                            })}




                        </div>
                    </PDFExport>
                    <div className='DownloadViewpdfCustomerFeedbackbuttonDivDele' ref={downloadBtnRef}>
                        <button onClick={handleDownload} className="DownloadViewpdfCustomerFeedbackDeleteClose">
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
                selectedFieldsWithLabels={selectedFieldsWithLabels1}
                selectedCheckboxes={selectedCheckboxes}
            />
            <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
                overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
                <Lottie animationData={Loader} style={style1} />
            </ReactModal>
        </div>
    )
}

export default CustomerSatisDownloadView