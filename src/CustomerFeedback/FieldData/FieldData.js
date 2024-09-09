import { useNavigate } from 'react-router-dom';
import './FieldData.css';
import { useEffect, useState, useContext } from 'react';
import { Url } from '../../Constants/APIUrlConstant';
import { contextData } from "../../Context/MyContext";
import Lottie from "lottie-react";
import ReactModal from 'react-modal';
import Loader from "../../CustomerFeedback/Assets/loader.json";
import Sidebar from '../../Sidebar/Sidebar';
import useCustomerDetails from '../../CommonComponents/CommonFielddata';
import CommonfelidDataques from '../../CommonComponents/CommonfelidDataques';

function FieldData() {
  const { sidebarExpanded, setSetsidebarExpanded, openModal } = useContext(contextData);
  const navigate = useNavigate();
  const [questionList, setQuetionList] = useState([]);
  const [isAdmin] = useState(atob(sessionStorage?.getItem('isAdmin')));
  const [showLoader, setShowLoader] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    'Name': '',
    'companyName': '',
    'projectName': '',
    'Role': '', // The role field
    'email': '',
    'date': '',
  });

  const style = {
    width: "25%",
    margin: "0 auto",
  };

  const navigateToHome = () => {
    setSetsidebarExpanded(true);
    navigate('/app/');
  };

  const navigateToDownload = () => {
    setSetsidebarExpanded(true);
    navigate('/app/main/CustomerNext');
  };

  const newBase64String = atob(sessionStorage.getItem('customerId'));

  useEffect(() => {
    setShowLoader(true);
    fetch(Url.getcustomerFeedbackList.replace('{id}', newBase64String), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        setShowLoader(false);
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {
          setQuetionList(data.DATA);
        }
      });
  }, [newBase64String, openModal]);

  useEffect(() => {
    setSetsidebarExpanded(true);
  }, [setSetsidebarExpanded]);

  const decodedValue = atob(sessionStorage.getItem('customerId'));
  useCustomerDetails(Url, decodedValue, setShowLoader, setLoginDetails, loginDetails);

  return (
    <div className='dataDiv'>
      <div className='FieldDataWrapper'>
        {isAdmin === 'admin' &&
          <div className='FieldDataSidebar' style={{ width: !sidebarExpanded ? "17%" : "4%" }}>
            <Sidebar />
          </div>
        }
        <div className={isAdmin === 'admin' ? 'FieldDatanewDiv' : 'FieldDatanewDiv1'} style={{ width: !sidebarExpanded ? "100%" : "96%" }}>
          <div className={`outerDiv`}>
            <div className='fillFeedbackDetailDiv'>
              <table>
                <tbody>
                  <tr>
                  <td>
                      <div className='fillFeedbackinformationDiv'>
                        <span className='label'>Project </span> <span className='procolon'>:</span>
                        <span className='contentDetails'>{loginDetails.projectName}</span>
                      </div>
                    </td>



                   
                    <td>
                      <div className='fillFeedbackinformationDiv'>
                        <span className='label'>Company </span> <span className='procolon1'>:</span>
                        <span className='contentDetails'>{loginDetails.companyName}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table>
                <tbody>
                  <tr>
                  <td>
                      <div className='fillFeedbackinformationDiv'>
                        <span className='label'>Name </span> <span className='procolon'>:</span>
                        <span className='contentDetails'>{loginDetails.Name}</span>
                      </div>
                    </td>
                    <td>
                      <div className='fillFeedbackinformationDiv'>
                        <span className='label'>Email </span> <span className='procolon1'>:</span>
                        <span className='contentDetails'>{loginDetails.email}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              {loginDetails.Role && (
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div className='fillFeedbackinformationDiv'>
                          <span className='label'>Role </span> <span className='procolon'>:</span>
                          <span className='contentDetails'>{loginDetails.Role}</span>
                        </div>
                      </td>
                      <td>
                        <div className='fillFeedbackinformationDiv'>
                          <span className='label' >Filled On </span> <span className='procolon1'>:</span>
                          <span className='contentDetails'>{loginDetails.date}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
              {!loginDetails.Role && (
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div className='fillFeedbackinformationDiv'>
                          <span className='label' style={{width:"92px"}}>Filled On </span> <span className='procolon1'>:</span>
                          <span className='contentDetails'>{loginDetails.date}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className='FieldDatacontentDataDiv'>
            {questionList?.map((item) => (
              <div className='FieldDatamainContentDiv' key={item.questionId}>
                <div className='FieldDataquestionDiv'>
                  <span className='FieldDatareviewquesStyle'>Question</span>
                  <span className={!sidebarExpanded ? 'FieldDatareviewquesSemiStyle1' : 'FieldDatareviewquesSemiStyle'}>:</span>
                  <span className='FieldDataquestionDetails'>{item.questionMaster.question}</span>
                </div>
                <div className={!sidebarExpanded ? 'FieldDataanswerDiv1' : 'FieldDataanswerDiv'}>
                  <span className='FieldDatareviewStyle' style={{ width: "64px" }}>Response</span>
                  <span className={!sidebarExpanded ? 'FieldData1' : 'FieldData'}>:</span>
                  <CommonfelidDataques item={item} />
                </div>
              </div>
            ))}
          </div>
          <div className='FieldDatamainButtonDiv'>
            {isAdmin === 'admin' &&
              <>
                <button className='backButton' onClick={navigateToHome}>Back</button>
                <button className='nextButton' onClick={navigateToDownload}>Download</button>
              </>
            }
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={showLoader}
        contentLabel="Minimal Modal Example"
        className="LoaderModal"
        ariaHideApp={false}
        overlayClassName="LoaderOverlay"
        shouldCloseOnOverlayClick={false}
      >
        <Lottie animationData={Loader} style={style} />
      </ReactModal>
    </div>
  );
}

export default FieldData;
