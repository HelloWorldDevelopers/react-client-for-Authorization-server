import React, { useEffect, useState, useContext } from 'react'
import ReactModal from 'react-modal'
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import Loader from "../../CustomerFeedback/Assets/loader.json"
import { Url } from '../../Constants/APIUrlConstant';
import '../CustomerSatisFieldData/CustomerSatisFieldData.css'
import Sidebar from '../../Sidebar/Sidebar';
import { contextData } from '../../Context/MyContext';
import useCustomerDetailsData from '../../CommonComponents/CommoncustomersatifelidData'
import CommonfelidDataques from '../../CommonComponents/CommonfelidDataques'
const CustomerSatisFieldData = () => {
  const { sidebarExpanded, setSetsidebarExpanded, openModal } = useContext(contextData)
  const navigate = useNavigate();
  const [isAdmin] = useState(atob(sessionStorage?.getItem('isAdmin')))
  const [showLoader, setShowLoader] = useState(false);
  const [questionList, setQuetionList] = useState([])
  const [loginDetails, setLoginDetails] = useState({
    'Name': '',
    'companyName': '',
    'projectName': '',
    'Role': '',
    'EmailID': '',
    "MobileNo": '',
    'date': ''
  })
  const style = {
    width: "25%",
    margin: "0 auto",
  };

  const navigateToHome = () => {
    setSetsidebarExpanded(true)
    navigate('/app/CSlink');
  }

  let decodedValue = atob(sessionStorage.getItem('SatisfactionId'));
  useCustomerDetailsData(Url, decodedValue, setShowLoader, setLoginDetails, loginDetails)


  useEffect(() => {
    setShowLoader(true)
    fetch(Url.getSubmitData.replace('{id}', decodedValue), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + sessionStorage.getItem('token'),
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      }
    })
      .then((respone) => respone.json())
      .then((data) => {
        console.log("Url.getSubmitData data", data)
        setShowLoader(false)
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          setQuetionList(data.DATA)
        }
      })
  }, [])

  const navigateToDownloadView = () => {
    setSetsidebarExpanded(true)
    navigate('/app/main/CSDownloadView')
  }

  useEffect(() => {
    setSetsidebarExpanded(true);
  }, [])

  return (
    <div className='customerSatisFieldDataDiv'>
      <div className='customerSatisFieldDataWrapper'>
        {isAdmin == 'admin' ? <div style={{ width: !sidebarExpanded ? "17%" : "4%", marginTop: !sidebarExpanded ? "" : "17px" }}>
          <Sidebar />
        </div> : <></>}

        <div className={isAdmin == 'admin' ? 'customerSatisFieldDatanewDiv' : 'customerSatisFieldDatanewDiv1'} style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
          <div className={`customerSatisFieldDataouterDiv`}>
            <div className='customerSatisFieldDataDetailDiv'>
              <table>
                <tr>
                  <td><div className='customerSatisFieldDatainformationDiv'>
                    <span className='label'>Name </span> <span className='colon'>:</span>
                    <span className='customerSatisFielddatacontentDetails'>{loginDetails.Name}</span>
                  </div></td>
                  <td><div className='customerSatisFieldDatainformationDiv'>
                    <span className='label'>Company </span> <span className='colon1' >:</span>
                    <span className='customerSatisFielddatacontentDetails'>{loginDetails.companyName}</span>
                  </div></td>
                </tr>
              </table>
              {
                loginDetails?.MobileNo && (
                  <table>
                  <tr style={{ display: "flex", justifyContent: !loginDetails?.MobileNo ? 'flex-end' : "flex-start" }}>
                    <td >
                      <div className='customerSatisFieldDatainformationDiv'>
                        <span className='label'>Mobile No </span> <span className='colon1' >:</span>
                        <span className='customerSatisFielddatacontentDetails' style={{ marginLeft: "10px" }}>{loginDetails.MobileNo}</span>
                      </div>
                    </td>
                    <td>
                      <div className='customerSatisFieldDatainformationDiv'>
                        <span className='label'>Email ID </span> <span className='colon'>:</span>
                        <span className='customerSatisFielddatacontentDetails'>{loginDetails.EmailID}</span>
                      </div>
                    </td>
                  </tr>
                </table>
                )
              }
             
              <table>
                <tr>
                  <td><div className='customerSatisFieldDatainformationDiv'>
                    <span className='label'>Filled On</span> <span className='colon'>:</span>
                    <span className='customerSatisFielddatacontentDetails'>{loginDetails.date}</span>
                  </div></td>
                  {
                    loginDetails?.MobileNo && (<td></td>)
                  }
                  {
                    !loginDetails?.MobileNo && (
                      <td><div className='customerSatisFieldDatainformationDiv'>
                      <span className='label'>Email ID </span> <span className='colon'>:</span>
                      <span className='customerSatisFielddatacontentDetails'>{loginDetails.EmailID}</span>
                    </div></td>
                    )
                  }
                
                </tr>
              </table>
            </div>
          </div>
          <div className='customerSatisFieldDatacontentDataDiv' style={{height:!loginDetails?.MobileNo ? '57vh' : '53vh'}}>
            {questionList?.map((item, index) => (
              <div className='customerSatisFieldDatamainContentDiv' key={item.questionId}>
                <div className='customerSatisFieldDataquestionDiv'>
                  <span className={!sidebarExpanded ? 'customerSatisFieldDatareviewquesStyle1' : 'customerSatisFieldDatareviewquesStyle'} >{`Question`}</span>
                  <span className={!sidebarExpanded ? 'customerSatisFieldDatareviewquesSemiStyle1' : 'customerSatisFieldDatareviewquesSemiStyle'}>:</span>
                  <span className='customerSatisFieldDataquestionDetails'>{item.questionMaster.question}</span>
                </div>
                <div className={!sidebarExpanded ? 'customerSatisFieldDataanswerDiv1' : 'customerSatisFieldDataanswerDiv'}>
                  <span className='customerSatisFieldDatareviewStyle'>Response</span>
                  <span className={!sidebarExpanded ? 'customerSatiFieldData1' : 'customerSatiFieldData'}>:</span>
                  <CommonfelidDataques item={item} />
                </div>
              </div>
            ))}


          </div>
          <div className='customerSatisFieldDatamainButtonDiv'>
            {isAdmin == 'admin' ? <><button className='nextButton' onClick={() => { navigateToHome() }}>Back</button></> : <></>}
            {isAdmin == 'admin' ? <><button className='nextButton' onClick={() => { navigateToDownloadView() }}>Download</button></> : <></>}
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

export default CustomerSatisFieldData