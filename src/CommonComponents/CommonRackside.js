import React from 'react'
import { decryptResponseToken } from '../Constants/EncryptDecryptFunc';

const CommonRackside = () => {


    const rbackData = JSON.parse(decryptResponseToken(sessionStorage.getItem('allRbacks')))
  let rbacks = {
    vendorOnboarding: false,
    empFeedback: false,
    custSatisfactionSurvey: false,
    projectEndFeedback: false,
  }
  rbackData?.forEach((item) => {
    switch (item?.useCase) {
      case "CUFEE VendorOnboarding":
        if (item.moduleAccess) {
          rbacks.vendorOnboarding = true;
        }
        break;
      case "CUFEE EmployeeFeedback":
        if (item.moduleAccess) {
          rbacks.empFeedback = true;
        }
        break;
      case "CUFEE CustomerSatisfactionSurvey":
        if (item.moduleAccess) {
          rbacks.custSatisfactionSurvey = true;
        }
        break;
      case "CUFEE ProjectEndFeedback":
        if (item.moduleAccess) {
          rbacks.projectEndFeedback = true;
        }
        break;
      default:
        break;
    }
  })
  return rbacks
}

export default CommonRackside
