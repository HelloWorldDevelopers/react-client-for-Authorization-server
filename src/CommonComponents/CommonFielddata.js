
import { useContext, useEffect } from 'react';
import { contextData } from '../Context/MyContext';

const useCustomerDetails = (Url, decodedValue, setShowLoader, setLoginDetails, loginDetails) => {
  const { openModal } = useContext(contextData);
  useEffect(() => {
    setShowLoader(true)
    fetch(Url.getcustomerDetails.replace("{id}", decodedValue),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + sessionStorage.getItem('token'),
          "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
      }
    )
      .then((respone) => respone.json())
      .then((data) => {
        console.log("get date",data)
        setShowLoader(false)
        if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
          openModal();
        } else {    
          setLoginDetails({
            ...loginDetails,
            ['Name']: data?.DATA?.feedbackBy,
            ['Role']: data?.DATA?.role,
            ['projectName']: data?.DATA?.project?.projectName,
            ['companyName']: data?.DATA?.project?.customer?.companyName,
            ['email']: data?.DATA?.emailId,
            ['date']: data?.DATA?.filledDate
          })
          sessionStorage.setItem('feedbackBy', data?.DATA?.feedbackBy)
          sessionStorage.setItem('feedbackcompany',data?.DATA?.project?.projectName)
        }
      });
  }, [Url, decodedValue, setShowLoader, setLoginDetails]);
};

export default useCustomerDetails;
