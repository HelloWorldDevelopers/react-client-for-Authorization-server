import React, { useContext, useState } from 'react'
import { Url } from '../Constants/APIUrlConstant'
import { contextData } from '../Context/MyContext';

const CommonVendor = () => {
    const { openModal } = useContext(contextData);
    const [showLoader, setShowLoader] = useState(false);
    const [uploadedSignForm, setUploadedSignForm] = useState([])
    const [vendorFormData, setVendorFormData] = useState({
        legalName: null,
        tradeName: null,
        companyType: null,
        telephoneNo: null,
        billingCity: null,
        billingState: null,
        billingCountry: null,
        billingZipCode: null,
        billingAddress1: null,
        billingAddress2: null,
        shippingCity: null,
        shippingState: null,
        shippingCountry: null,
        shippingZipCode: null,
        shippingAddress1: null,
        shippingAddress2: null,
        spocContactName: null,
        escalationContactName: null,
        salesContactName: null,
        accContactName: null,
        spocEmail: null,
        escalationEmail: null,
        salesEmail: null,
        accEmail: null,
        spocMno: null,
        escalationMno: null,
        salesMno: null,
        accMno: null,
        spocTelNo: null,
        escalationTelNo: null,
        salesTelNo: null,
        accTelNo: null,
        bankName: null,
        branch: null,
        ifscCode: null,
        bankAddress1: null,
        bankAddress2: null,
        bankCity: null,
        bankCountry: null,
        bankState: null,
        bankZipCode: null,
        benificaryAccName: null,
        accNo: null,
        bankAddress: null,
        companyTurnOver: null,
        swift: null,
        intermediary: null,
        name: null,
        designation: null,
        date: new Date(),
    })
    var decodedValue = sessionStorage.getItem('ID') || localStorage?.getItem('ID')
    const [getVendorFormData, setgetVendorFormData] = useState({
        legalName: null,
        tradeName: null,
        companyType: null,
        telephoneNo: null,
        billingCity: null,
        billingState: null,
        billingCountry: null,
        billingZipCode: null,
        billingAddress1: null,
        billingAddress2: null,
        shippingCity: null,
        shippingState: null,
        shippingCountry: null,
        shippingZipCode: null,
        shippingAddress1: null,
        shippingAddress2: null,
        spocContactName: null,
        escalationContactName: null,
        salesContactName: null,
        accContactName: null,
        spocEmail: null,
        escalationEmail: null,
        salesEmail: null,
        accEmail: null,
        spocMno: null,
        escalationMno: null,
        salesMno: null,
        accMno: null,
        spocTelNo: null,
        escalationTelNo: null,
        salesTelNo: null,
        accTelNo: null,
        bankName: null,
        branch: null,
        ifscCode: null,
        bankAddress1: null,
        bankAddress2: null,
        bankCity: null,
        bankCountry: null,
        bankState: null,
        bankZipCode: null,
        benificaryAccName: null,
        accNo: null,
        accCurrency: null,
        bankAddress: null,
        companyTurnOver: null,
        swift: null,
        intermediary: null,
        name: null,
        designation: null,
        isUnderGst: null,
        isUnderTaxExemptions: null,
        isUnderMsme: null,
        isItrFiled: null
    })

    const [documentAttachment, setDocumentAttach] = useState([])
    const [getCoreGoodServies, setCoreGoodServices] = useState([])
    const [getMajorCustomers, setMajorCustomers] = useState([])
    const [getGSTDetails, setGSTDetails] = useState([])
    const [serviceProvidedList, setServiceProvidedList] = useState([])
    const [formFilled, setFormFilled] = useState()
    const [filledstatus, setfillStatus] = useState()
    const [goodServices, setGoodServices] = useState('')
    const [customer, setcustomer] = useState('')
    const [msmeOption, setMsmeOption] = useState({
        yes: false,
        no: false
    });
    const [submittedFormStatus, setSubmittedFormStstus] = useState()
    const getVendorData = () => {
        setShowLoader(true)
        fetch(Url.getVendorFormData.replace("{id}", decodedValue), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((respone) => respone.json())
            .then((data) => {
                setShowLoader(false)
                console.log("get form data",data)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    // let dateFomate = moment(data?.DATA?.parseDate,'DD-MM-YYYY')
                    const objectToSet = {
                        legalName: data?.DATA?.leagalName,
                        tradeName: data?.DATA?.tradeName,
                        companyType: data?.DATA?.companyType,
                        telephoneNo: data?.DATA?.telephoneNo,
                        billingCity: data?.DATA?.billingCity,
                        billingState: data?.DATA?.billingState,
                        billingCountry: data?.DATA?.billingcountryMaster?.country,
                        billingZipCode: data?.DATA?.billingZipCode,
                        billingAddress1: data?.DATA?.billingAddressLine1,
                        billingAddress2: data?.DATA?.billingAddressLine2,
                        shippingCity: data?.DATA?.shippingCity,
                        shippingState: data?.DATA?.shippingState,
                        shippingCountry: data?.DATA?.shippingcountryMaster?.country,
                        shippingZipCode: data?.DATA?.shippingZipCode,
                        shippingAddress1: data?.DATA?.shippingAddressLine1,
                        shippingAddress2: data?.DATA?.shippingAddressLine2,
                        escalationContactName: data?.DATA?.escalationName,
                        salesContactName: data?.DATA?.salesName,
                        accContactName: data?.DATA?.accountsName,
                        escalationEmail: data?.DATA?.escalationEmail,
                        salesEmail: data?.DATA?.salesEmail,
                        accEmail: data?.DATA?.accountsEmail,
                        escalationMno: data?.DATA?.escalationMobile,
                        salesMno: data?.DATA?.salesMobileNo,
                        accMno: data?.DATA?.accountsMobileNo,
                        escalationTelNo: data?.DATA?.escalationTel,
                        salesTelNo: data?.DATA?.salesTelNo,
                        accTelNo: data?.DATA?.accountsTelNo,
                        bankName: data?.DATA?.venderBankDetails?.bankName,
                        branch: data?.DATA?.venderBankDetails?.branch,
                        ifscCode: data?.DATA?.venderBankDetails?.ifscCode,
                        bankAddress1: data?.DATA?.venderBankDetails?.bankAddressLine1,
                        bankAddress2: data?.DATA?.venderBankDetails?.bankAddressLine2,
                        bankCity: data?.DATA?.venderBankDetails?.city,
                        bankCountry: data?.DATA?.venderBankDetails?.countryMaster?.country,
                        bankState: data?.DATA?.venderBankDetails?.state,
                        bankZipCode: data?.DATA?.venderBankDetails?.zipCode,
                        benificaryAccName: data?.DATA?.venderBankDetails?.beneficiaryAccName,
                        accNo: data?.DATA?.venderBankDetails?.accountNo,
                        accCurrency: data?.DATA?.venderBankDetails?.accCurrency,
                        companyTurnOver: data?.DATA?.venderBankDetails?.companyTurnover,
                        swift: data?.DATA?.venderBankDetails?.swiftCode,
                        intermediary: data?.DATA?.venderBankDetails?.intermediaryBankDtl,
                        name: data?.DATA?.declName,
                        designation: data?.DATA?.declDesignation,
                        isUnderMsme: data?.DATA?.isUnderMsme,
                        isUnderTaxExemptions: data?.DATA?.isUnderTaxExemptions,
                        isUnderGst: data?.DATA?.isUnderGst,
                        isItrFiled: data?.DATA?.venderBankDetails?.isItrFiled,
                        date: data?.DATA?.parseDate,
                    }
                    setgetVendorFormData(objectToSet)
                    setVendorFormData(objectToSet)
                    setFormFilled(data?.DATA?.formFilled)
                    setfillStatus(data?.DATA?.status)
                    setDocumentAttach(data?.DATA?.vendorDocumentAttachmentList)
                    setCoreGoodServices(data?.DATA?.vendorCoreGoodServicesList)
                    setMajorCustomers(data?.DATA?.vendorMajorCustomerList)
                    setGSTDetails(data?.DATA?.gstdetailsList)
                    setServiceProvidedList(data?.DATA?.vendorServiceProviderList)
                    setUploadedSignForm(data?.DATA?.vendorDocumentAttachmentList)
                    console.log("get filled data", data)
                    setSubmittedFormStstus(data?.DATA?.formFilled)
                }
            }).catch((err) => {
                console.log("Submit Error", err);
                setShowLoader(false)
            });
    }

    return {

        setVendorFormData,
        vendorFormData,
        getVendorFormData,
        setgetVendorFormData,
        getVendorData,
        serviceProvidedList,
        getGSTDetails,
        getMajorCustomers,
        getCoreGoodServies,
        documentAttachment,
        formFilled,
        showLoader,
        setShowLoader,
        filledstatus,
        uploadedSignForm,
        customer,
        goodServices,
        setcustomer,
        setGoodServices,
        setMsmeOption,
        msmeOption,
        submittedFormStatus
    }

}

export default CommonVendor