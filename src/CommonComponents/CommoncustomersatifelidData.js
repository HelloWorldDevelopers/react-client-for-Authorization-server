import { useEffect } from "react";

 const useCustomerDetailsData = (Url,decodedValue, setShowLoader, setLoginDetails, loginDetails) =>{
    useEffect(() => {
        setShowLoader(true)
        fetch(
          Url.getCreateLinkLoginData.replace("{custSatisfactionId}", decodedValue),
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
            console.log("get customer satis date",data)
            setShowLoader(false)
            setLoginDetails({
              ...loginDetails,
              ['Name']: data?.DATA?.addressMaster?.contactPersonName,
              ['companyName']: data?.DATA?.addressMaster.customer?.companyName,
              ['EmailID']: data?.DATA?.addressMaster?.contactPersonEmail,
              ['MobileNo']: data?.DATA?.addressMaster?.contactPersonNo,
              ['date']: data?.DATA?.filledDate
    
            })
            sessionStorage.setItem('feedbackBy', data?.DATA?.feedbackBy)
          });
      }, [Url,decodedValue, setShowLoader, setLoginDetails]);
}
export default useCustomerDetailsData;

