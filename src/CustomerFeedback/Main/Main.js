import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import CustomerSatisfactionSurvey from '../CustomerForm/CustomerSatisfactionSurvey';
import './main.css'
import FieldData from '../FieldData/FieldData';
import CustomerNextSatisfaction from "../Preview/CustomerNextSatisfactionSurvey"
import CustomerSatisFieldData from "../../CustomerSatisfactionSurvey/CustomerSatisFieldData/CustomerSatisFieldData"
import CustomerSatisDownloadView from '../../CustomerSatisfactionSurvey/CustomerSatisDownloadView/CustomerSatisDownloadView';
import CustomerSatisForm from '../../CustomerSatisfactionSurvey/CustomerSatisForm/CustomerSatisForm';
import VendorKYCForm from '../../VendorKYC/VendorKYCForm/VendorKYCForm'
import VendorFillForm from '../../VendorKYC/VendorFillForm/VendorFillForm';
import EmployeeFieldData from '../../EmployeeFeedback/EmployeeFieldData/EmployeeFieldData';
import EmployeeDownloadView from '../../EmployeeFeedback/EmployeeDownloadView/EmployeeDownloadView';
import EmployeeForm from '../../EmployeeFeedback/EmployeeForm/EmployeeForm';
import Main_login from '../../Main_login';
const Main = () => {
  const [projectName, setProjectName] = useState(sessionStorage?.getItem('projectName'))
  const [isAdmin, setIsAdmin] = useState(sessionStorage?.getItem('isAdmin'))
  // console.log(projectName, "drdrd")
  const location = useLocation();
  const hideHeaderText = location.pathname === '/KYCForm' || location.pathname === '/FilledVendorForm';
  const ID = sessionStorage.getItem("customerId")
  const role = sessionStorage.getItem('role');

  return (
    <div className='mainComponent'>
      <div className='HeaderDiv'>
        <Header hideText={hideHeaderText} />
      </div>
      <Routes>
            <Route path='/KYCForm/:id' element={<VendorKYCForm />} />
            <Route path='/FilledVendorForm' element={<VendorFillForm />} />
         
            <Route path="/FeedbackForm" element={<CustomerSatisfactionSurvey />} />
            <Route path="/FilledFeedbackForm/:id" element={<FieldData />} />
            <Route path="/CSFilledFeedbackForm/:id" element={<CustomerSatisFieldData />} />
            <Route path="/CSDownloadView" element={<CustomerSatisDownloadView />} />
            <Route path="/CustomerNext" element={<CustomerNextSatisfaction />} />
            <Route path="/CustomersatisfactionSurvey" element={<CustomerSatisForm />} />
            <Route path='/EmployeeFilledFeedback/:id' element={<EmployeeFieldData />} />
            <Route path="/EmployeeDownloadView" element={<EmployeeDownloadView />} />
            <Route path="/EmployeeForm" element={<EmployeeForm />} />
         
        
      </Routes>
      <div className='footerDiv'>
        <Footer />
      </div>
      {/* </> : <><span>Cannot Access</span></>} */}
    </div>
  );
};
export default Main;

