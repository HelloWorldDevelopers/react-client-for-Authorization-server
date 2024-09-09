import { useEffect, useState, useContext } from 'react';
import './EmployeeFieldData.css';
import { Url } from '../../Constants/APIUrlConstant';
import { contextData } from "../../Context/MyContext"
import Lottie from "lottie-react";
import ReactModal from 'react-modal';
import Loader from "../../CustomerFeedback/Assets/loader.json"
import Sidebar from '../../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import CommonEmployeefelid from '../../CommonComponents/CommonEmployeefelid'
import CommonfelidDataques from '../../CommonComponents/CommonfelidDataques'

const EmployeeFieldData = () => {
    const navigate = useNavigate();
    const [questionList, setQuetionList] = useState([])
    const [isAdmin] = useState(atob(sessionStorage?.getItem('isAdmin')))
    const [showLoader, setShowLoader] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        'name': '',
        'projectName': '',
        'projectManager': '',
        'email': '',
        'date': ''

    })
    const { sidebarExpanded, setSetsidebarExpanded, openModal } = useContext(contextData)
    const style = {
        width: "25%",
        margin: "0 auto",
    };

    console.log(showLoader, 'showLoader')


    const navigateToHome = () => {
        setSetsidebarExpanded(true)
        navigate('/app/EmployeeLink');
    }

    const navigateToDownload = () => {
        setSetsidebarExpanded(true)
        navigate('/app/main/EmployeeDownloadView');
    }
    let decodemloy = atob(sessionStorage.getItem('employeeID'))
    useEffect(() => {
        setShowLoader(true)
        fetch(Url.getSubmittedEmployeeFeedback.replace('{id}', decodemloy), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
            }
        })
            .then((respone) => respone.json())
            .then((data) => {
                console.log("data employee", data)
                setShowLoader(false)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    setQuetionList(data.DATA)
                }
            })
    }, [])
    useEffect(() => {
        setSetsidebarExpanded(true);
    }, [])
    const decode = atob(sessionStorage.getItem('employeeID'));
    CommonEmployeefelid(Url, decode, setShowLoader, setLoginDetails, loginDetails);


    useEffect(() => {
        sessionStorage.setItem('empName', loginDetails?.name);
    }, [loginDetails.name])

    return (
        <div className='dataDiv'>

            <div className='employeeFieldDataWrapper'>
                {isAdmin == 'admin' ?
                    <div className='employeeFieldDataSidebar' style={{ width: !sidebarExpanded ? "17%" : "4%",marginTop:!sidebarExpanded ? "-10px":"-13px" }}>
                        <Sidebar />
                    </div> : <></>}

                <div className={isAdmin == 'admin' ? 'employeeFieldDatanewDiv' : 'employeeFieldDatanewDiv1'} style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
                    <div className={`employeeOuterDiv`}>
                        <div className='employeeFillFeedbackDetailDiv'>
                            <table>
                                <tr>
                                    <td><div className='employeeFillFeedbackinformationDiv'>
                                        <span className='label'>Employee Name </span> <span style={{ position: "relative", left: "-28px" }}>:</span>
                                        <span className='employeeContentDetails' style={{ position: "relative", left: "-7px", marginTop: '1px' }}>{loginDetails.name}</span>
                                    </div></td>
                                    <td><div className='employeeFillFeedbackinformationDiv'>
                                        <span className='label' style={{ marginTop: '2px' }}>Project Manager </span> <span style={{ position: "relative", left: "-28px" }}>:</span>
                                        <span className='employeeContentDetails' style={{ position: "relative", left: "-7px", marginTop: '1px' }}>{loginDetails.projectManager}</span>
                                    </div></td>
                                    
                                </tr>
                            </table>
                            <table>
                                <tr>
                                <td><div className='employeeFillFeedbackinformationDiv'>
                                        <span className='label' >Project Name </span> <span style={{ position: "relative", left: "4px", width: '26%' }}>:</span>
                                        <span className='employeeContentDetails' style={{ position: "relative", left: "-76px", marginTop: '1px' }}>{loginDetails.projectName}</span>
                                    </div></td>
                                    <td><div className='employeeFillFeedbackinformationDiv'>
                                        <span className='label' >Email ID</span> <span style={{ position: "relative", left: "-1px", width: '20%' }}>:</span>
                                        <span className='employeeContentDetails' style={{ position: "relative", left: "-63px", marginTop: '1px' }}>{loginDetails.email}</span>
                                    </div></td>
                                </tr>
                            </table>
                            <table>
                                <tr>
                                    <td><div className='employeeFillFeedbackinformationDiv'>
                                        <span className='label' style={{ marginTop: '2px' }}>Filled On</span> <span style={{ position: "relative", left: "-28px" }}>:</span>
                                        <span className='employeeContentDetails' style={{ position: "relative", left: "-7px", marginTop: '1px' }}>{loginDetails.date}</span>
                                    </div></td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className='employeeFieldDatacontentDataDiv'>
                        {questionList?.map((item, i) => (
                            <div className='employeeFieldDatamainContentDiv' key={item.questionId}>
                                <div className='employeeFieldDataquestionDiv'>
                                    <span className='employeeFieldDatareviewquesStyle' style={{ marginLeft: !sidebarExpanded ? "8px" : "" }}>{`Question`}</span>
                                    <span className='employeeFieldDatareviewquesSemiStyle' style={{ marginLeft: !sidebarExpanded ? "15px" : "11px" }}>:</span>
                                    <span className='employeeFieldDataquestionDetails'>{item.questionMaster.question}</span>
                                </div>
                                <div className='employeeFieldDataanswerDiv' style={{ width: !sidebarExpanded ? "88%" : "" }}>
                                    <span className='employeeFieldDatareviewStyle' style={{ width: !sidebarExpanded ? "8%" : "62px" }}>Response</span>
                                    <span className='employeeFieldData'>:</span>
                                    <CommonfelidDataques item={item}/>

                                </div>
                            </div>))}
                    </div>
                    <div className='employeeFieldDatamainButtonDiv'>
                        {isAdmin == 'admin' ? <button className='backButton' onClick={() => { navigateToHome() }}>Back</button> : <></>}
                        {isAdmin == 'admin' ? <button className='nextButton' onClick={() => { navigateToDownload() }}>Download</button> : <></>}

                    </div>

                </div>

            </div>

            <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
                overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
                <Lottie animationData={Loader} style={style} />
            </ReactModal>
        </div>
    )
}

export default EmployeeFieldData