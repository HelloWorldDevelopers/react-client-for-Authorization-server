import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import NoMatch from './NoMatch/NoMatch';
import MyContext from './Context/MyContext';
import Main from '../src/CustomerFeedback/Main/Main';
import CreateLink from './CreateLink/CreateLink';
import CustomerSatisCreateLink from '../src/CustomerSatisfactionSurvey/CustomerSatisCreateLink/CustomerSatisCreateLink';
import CustomerSatisfactionLogin from '../src/CustomerSatisfactionSurvey/CustomerSatisfactionLogin/CustomerSatisfactionLogin';
import Sidebar from './Sidebar/Sidebar';
import VendorKycCreateLink from './VendorKYC/VendorKYCCreateLink/VendorKYCCreatelink';
import VendorKYCLogin from './VendorKYC/VendorKYCLogin/VendorKYCLogin';
import EmployeeCreateLink from './EmployeeFeedback/EmployeeCreateLink/EmployeeCreateLink';
import EmployeeLogin from './EmployeeFeedback/EmployeeLogin/EmployeeLogin';
import './App.css'
import CommonRackside from '../src/CommonComponents/CommonRackside';
import UserrSideSubmittedScreen from './CommonComponents/UserSideSubmittedScreen/UserrSideSubmittedScreen';


function App() {

  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    const disableBackButton = () => {
      window.history.forward();
    };
    window.addEventListener('popstate', disableBackButton);
    return () => {
      window.removeEventListener('popstate', disableBackButton);
    };
  }, []);


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const isPathAfterOpeningLink = location.pathname?.includes("CustomerSatisfactionGetStarted") || location.pathname?.includes("GetStarted") || location.pathname?.includes("EmployeeGetStarted") || location.pathname?.includes("KYCGetStarted") || location.pathname?.includes("/main/KYCForm")
    if (!token && !isPathAfterOpeningLink) {
      navigate("/");
    }
  }, []);

  const rbacks = CommonRackside();
  // console.log("=========================rbacks=============================")
  // console.log("herughurhrehguhre",rbacks)
  // console.log("=======naun===============================================")

  return (
    <MyContext>
      <div className='mainComponentDiv'>
        <Routes>
          {
            rbacks?.projectEndFeedback &&

            
            <Route exact path="/" element={<CreateLink />} />
          }
          {
            rbacks?.vendorOnboarding &&

            <>

<Route path="/" element={<Navigate to={'/app/kycLink'} />} />

                        <Route path="/kycLink" element={<VendorKycCreateLink />} />

            </>
          }

          {
            rbacks?.empFeedback &&
            <>
              <Route path="/" element={<Navigate to={'/app/EmployeeLink'} />} />
              <Route path="/EmployeeLink" element={<EmployeeCreateLink />} />
            </>
          }

          {
            rbacks?.custSatisfactionSurvey &&
            <>
              <Route path="/" element={<Navigate to={'/app/CSLink'}/>} />

                 <Route path="/CSLink" element={<CustomerSatisCreateLink />} />
            </>
          
          }
          <Route path='/KYCGetStarted/:id' element={<VendorKYCLogin />} />

          <Route path="/GetStarted/:id" element={<Login />} />
          <Route path="/CustomerSatisfactionGetStarted/:id" element={<CustomerSatisfactionLogin />} />
          <Route path='/EmployeeGetStarted/:id' element={<EmployeeLogin />} />
          <Route path='/SubmittedScreen' element={<UserrSideSubmittedScreen />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="*" element={<NoMatch />} />
          <Route path='/main/*' element={<Main />} />
        </Routes>
      </div>
    </MyContext>
  );
}

export default App;
