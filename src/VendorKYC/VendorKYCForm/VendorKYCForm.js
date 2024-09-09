import React, { useContext, useEffect, useRef, useState } from 'react'
import '../VendorKYCForm/VendorKYCForm.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import upload from '../../CustomerFeedback/Assets/uploadFormImg.svg'
import cancel_btn from "../../CustomerFeedback/Assets/cancel.svg";
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import ReactModal from "react-modal";
import {
    validateAlphabets,

    validateDigits,
    validateEmpty,
    validateEmail,
    validatePan,
    validateAlphanumeric,
    validateSelectEmpty,
    validateGstNo,
    validateCompSchemeUnderGst,
    validateIFSC,
    validateBankName,
    validateMobileNumber,
    validateZipCode,
    validateServiceAccgCode
} from '../../VendorKYC/Validations/Validation';
import { Url } from '../../Constants/APIUrlConstant';
import CommonVendor from '../../CommonComponents/CommonVendor';
import VendorShippingAddress from '../../CommonComponents/VendorShippingAddress';
import { contextData } from '../../Context/MyContext';
import Loader from "../../CustomerFeedback/Assets/loader.json"
import Lottie from "lottie-react";
const VendorKYCForm = () => {
    const { openModal } = useContext(contextData);
    let decodedValue = sessionStorage.getItem('ID') || localStorage?.getItem('ID');
    let sessionRole = sessionStorage.getItem('role');
    const navigate = useNavigate();
    const { id } = useParams();
    const [showSuccessModal, setshowSuccessModal] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [shippingAddressToggle, setShippingAddresstoggle] = useState(true)
    const [submittedStatus, setSubmittedStatus] = useState()
    const [selectedFileType, setSelectedFileType] = useState('');
    const [selectedFilePath, setSelectedFilePath] = useState('');
    const [showImgModal, setshowImgModal] = useState(false);
    const [uploadedStatus, setUploadedStatus] = useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [isDeclarationChecked, setIsDeclarationChecked] = useState(false)
    localStorage.setItem('checkboxStatus', isDeclarationChecked)
    const {
        vendorFormData,
        setVendorFormData,
        setgetVendorFormData,
        getVendorFormData,
        getVendorData,
        serviceProvidedList,
        getGSTDetails,
        getMajorCustomers,
        getCoreGoodServies,
        documentAttachment,
        showLoader,
        setShowLoader,
        customer,
        goodServices,
        setcustomer,
        setGoodServices,
        setMsmeOption,
        msmeOption,
        submittedFormStatus
    } = CommonVendor();

    const [gstOption, setGstOption] = useState({
        yes: false,
        no: false
    });
    const [taxExemptionOption, setTaxExemptionOption] = useState({
        yes: false,
        no: false
    });

    const style = {
        width: "25%",
        margin: "0 auto",
    };


    const [, setAddGstNew] = useState(false)
    const [itrFilledOption, setItrFilledOption] = useState({
        yes: false,
        no: false
    })

    const [fileUploadInfo, setFileUploadInfo] = useState('');
    const [items, setItems] = useState({
        companyIncorporation: false,
        cancelledCheque: false,
        panCard: false,
        gstCertificate: false,
        bankStatement: false,
        msmeCertificate: false,
        itrCertificate: false
    });
    const [fileInputs, setFileInputs] = useState({
        companyIncorporation: null,
        cancelledCheque: null,
        panCard: null,
        gstCertificate: null,
        bankStatement: null,
        msmeCertificate: null,
        itrCertificate: null
    });

    const [fileInfo] = useState({
        filename: null,
        filetype: null,
        base64String: null
    });

    const initialGstDetailsList = [{
        gstNo: null,
        panNo: null,
        gstAddress: null,
        vendorStateGSTCode: {
            stateGstCodeId: null
        }
    }]
    const [gstDetailsList, setGstDetailsList] = useState(initialGstDetailsList);

    useEffect(() => {
        const localId = localStorage.getItem('ID');
        if (localId) {
            setSubmittedStatus(true)
            sessionStorage.setItem('submitStatus', true);
        }
        setFetchAgain(!fetchAgain)
        return () => {
            localStorage.removeItem("ID");
        }
    }, [])

    const fetchStateFromGstCode = (index, gstCode) => {
        fetch(Url.getStateFromGstNo.replace("{code}", gstCode), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("get state", data)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    if (data?.DATA?.state && data?.DATA?.stateGstCodeId) {
                        setGstDetailsList(prevList => {
                            const updatedList = prevList.map((entry, i) =>
                                i === index ? {
                                    ...entry,
                                    taxState: data.DATA.state,
                                    vendorStateGSTCode: {
                                        stateGstCodeId: data.DATA.stateGstCodeId
                                    }
                                } : entry
                            );
                            return updatedList;
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching state:', error);
            });
    };

    const handleInputValues1 = (index, key, value) => {
        setGstDetailsList(prevList => {
            const updatedList = prevList.map((entry, i) =>
                i === index ? { ...entry, [key]: value } : entry
            );

            if (key === 'taxCode') {
                if (value === '') {
                    return updatedList.map((entry, i) =>
                        i === index ? {
                            ...entry,
                            taxCode: '',
                            taxState: '',
                            gstNo: '',
                            panNo: '',
                            gstAddress: '',
                            vendorStateGSTCode: {
                                stateGstCodeId: null
                            }
                        } : entry
                    );
                } else {
                    const gstCode = value;
                    fetchStateFromGstCode(index, gstCode);
                }
            }

            return updatedList;
        });
    };

    const handleAddGSTField = () => {
        const prevGstDetails = gstDetailsList || [];
        setGstDetailsList([...prevGstDetails, initialGstDetailsList])
    }

    const handleRemoveGSTField = (index) => {
        setGstDetailsList((prevList) => {
            const newList = [...prevList];
            newList.splice(index, 1);
            return newList;
        })
    }

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const handleCloseSuccModal = () => {
        setshowSuccessModal(false);
    };

    const [listData, setListData] = useState([]);
    const handleGoodService = (value) => {
        setGoodServices(value)
        updateListData(value)
    }


    const updateListData = (htmlContent) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Select both <li> and <p> tags that are direct children of the editor's root
        const listItems = Array.from(tempDiv.children).filter(child => ['li', 'p'].includes(child.tagName?.toLowerCase()));

        const parsedListData = listItems.map((item, index) => {
            let coreGoodsService = item.innerText?.trim();

            // Check if the item starts with a numbered or bulleted pattern
            if (item.tagName?.toLowerCase() === 'li') {
                const match = coreGoodsService.match(/^[0-9a-zA-Z]+[.)]/);

                if (match) {
                    coreGoodsService = coreGoodsService?.substring(match[0]?.length)?.trim();
                }
            }

            return {
                coreGoodsService
            };
        });

        setListData(parsedListData);
    }
    console.log("gggggg", listData)

    const modules = {
        toolbar: [
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // ['bold', 'italic', 'underline'],
            // [{ 'color': [] }, { 'background': [] }],
            // [{ 'align': [] }],
            // ['clean']
        ],
    }

    const handleCustomer = (value) => {
        setcustomer(value)
        updateCustomerListData(value)
    }

    const [customerListdata, setCustomerListData] = useState([])
    const updateCustomerListData = (htmlContent) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Select both <li> and <p> tags that are direct children of the editor's root
        const listItems = Array.from(tempDiv.children).filter(child => ['li', 'p'].includes(child.tagName?.toLowerCase()));

        const parsedListData = listItems.map((item, index) => {
            let majorCustomer = item.innerText?.trim();

            // Check if the item starts with a numbered or bulleted pattern
            if (item.tagName?.toLowerCase() === 'li') {
                const match = majorCustomer.match(/^[0-9a-zA-Z]+[.)]/);

                if (match) {
                    majorCustomer = majorCustomer?.substring(match[0]?.length)?.trim();
                }
            }
            return {
                majorCustomer
            };
        });
        setCustomerListData(parsedListData);
    }

    const handleSubmit = () => {
        if (isChecked) {
            setSubmittedStatus(true);
        } else {
            alert('Please accept the declaration by checking the checkbox.');
        }
    };

    const currencyList = [
        { id: 1, value: "select", label: "Select" },
        { id: 2, value: "AMD ֏ - Armenian dram", label: "AMD ֏ - Armenian dram" },
        { id: 3, value: "ANG ƒ - Netherlands Antillean guilder", label: "ANG ƒ - Netherlands Antillean guilder" },
        { id: 4, value: "AUD $ - Australian Dollar", label: "AUD $ - Australian Dollar" },
        { id: 5, value: "BBD $ - Barbados dollar", label: "BBD $ - Barbados dollar" },
        { id: 6, value: "BHD BD - Bahraini Dinar", label: "BHD BD - Bahraini Dinar" },
        { id: 7, value: "BMD $ - Bermuda dollar", label: "BMD $ - Bermuda dollar" },
        { id: 8, value: "CAD $ - Canadian Dollar", label: "CAD $ - Canadian Dollar" },
        { id: 9, value: "CHF Fr. - Swiss Franc", label: "CHF Fr. - Swiss Franc" },
        { id: 10, value: "CNY ¥ - Ren-Min-Bi yuan", label: "CNY ¥ - Ren-Min-Bi yuan" },
        { id: 11, value: "DJF € - Djiboutian franc", label: "DJF € - Djiboutian franc" },
        { id: 12, value: "EGP £ - Egyptian pound", label: "EGP £ - Egyptian pound" },
        { id: 13, value: "EUR € - Euro", label: "EUR € - Euro" },
        { id: 14, value: "INR ₹ - Indian rupee", label: "INR ₹ - Indian rupee" },
        { id: 15, value: "JPY ¥ - Japanese Yen", label: "JPY ¥ - Japanese Yen" },
        { id: 16, value: "KRW ₩ - Korea (South) Won", label: "KRW ₩ - Korea (South) Won" },
        { id: 17, value: "MZN MT - Mozambique Metical", label: "MZN MT - Mozambique Metical" },
        { id: 18, value: "MYR RM - Malaysian Ringgit", label: "MYR RM - Malaysian Ringgit" },
        { id: 19, value: "SAR ﷼ - Saudi Arabia Riyal", label: "SAR ﷼ - Saudi Arabia Riyal" },
        { id: 20, value: "SGD $ - Singapore Dollar", label: "SGD $ - Singapore Dollar" },
        { id: 21, value: "USD $ - U.S. dollar", label: "USD $ - U.S. dollar" },
        { id: 22, value: "YER ﷼ - Yemen Rial", label: "YER ﷼ - Yemen Rial" },
        { id: 23, value: "ZAR R - South African Rand", label: "ZAR R - South African Rand" },
    ]

    const notifyPdfAlert = () => {
        toast.error('Only PDF files are allowed');
    };

    const notifyFileSizeAlert = () => {
        toast.error('File size exceeds 300 KB. Please upload a smaller file.');
    };

    const notifyFileAlreadySelectedAlert = () => {
        toast.error('File is already selected.');
    };

    const [prevFileNames, setPrevFileNames] = useState({});
    const handleFileInputChange = (id, itemName, e) => {
        const file = e.target.files[0];
        const filename = file.name;
        const filetype = file.type;
        const filesize = file.size; // size in bytes

        // File size limit: 300 KB (300 * 1024 bytes)
        const maxSize = 300 * 1024;

        if (filetype !== 'application/pdf') {
            notifyPdfAlert();
            e.target.value = null;
            return;
        }

        if (filesize > maxSize) {
            notifyFileSizeAlert(); // Notify the user about the file size limit
            e.target.value = null;
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFileInputs(prevInputs => ({
                ...prevInputs,
                [itemName]: {
                    id: id,
                    file: base64String,
                    filename: filename,
                    filetype: filetype
                }
            }));
        }
        reader.readAsDataURL(file);
    };
    console.log("ffffffffff", fileInputs)
   
    const handleCheckboxChange = (itemName, e) => {
        const isChecked = e.target.checked;
        const value = e.target.value;

        setItems(prevItems => ({
            ...prevItems,
            [itemName]: isChecked ? value : null
        }));
        if (!isChecked) {
            setFileInputs(prevInputs => ({
                ...prevInputs,
                [itemName]: null
            }));
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType !== 'application/pdf') {
                notifyPdfAlert();
                event.target.value = null;
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.split(',')[1];
                const documentAttachment = base64String; // Add the base64 string here
                const fileName = file.name;
                const fileType = file.type;

                const uploadInfo = {
                    documentAttachment,
                    fileName,
                    fileType,
                    vendorDocumentMaster: {
                        documentId: 10 // Adjust this value as needed
                    }
                }
                setFileUploadInfo(uploadInfo);
            }

            reader.readAsDataURL(file);
            toast.success('Signed Form Uploaded Successfully.');
        } else {
            setFileUploadInfo('No file selected');
        }
    };

    const handleMSMECheckbox = (option) => {
        if (option == 'yes') {
            setMsmeOption({ yes: true, no: false })
        }
        else {
            setMsmeOption({ yes: false, no: true })
            setFileInputs({
                ...fileInputs,
                msmeCertificate: null
            })
            setItems({
                ...items,
                msmeCertificate: false,
            })
        }
    }

    const handleTaxCheckboxChange = (option) => {
        if (option === 'yes') {
            setTaxExemptionOption({ yes: true, no: false });
        } else {
            if (option === 'no') {
                setTaxExemptionOption({ yes: false, no: true });
            }
        }
    }

    const handleITRCheckbox = (option) => {
        if (option == 'yes') {
            setItrFilledOption({ yes: true, no: false })
        }
        else {
            setItrFilledOption({ yes: false, no: true })
            setFileInputs({
                ...fileInputs,
                itrCertificate: null
            })
            setItems({
                ...items,
                itrCertificate: false,
            })
        }
    }

    const handleInputValues = (field, e) => {
        let value = e.target.value;

        if (!/\s/.test(value)) {
            value = value.trim();
        } else {
            value = value.replace(/^\s+/, '');
        }
        value = value.replace(/ {2,}/g, ' ');

        const fieldsToCapitalize = [
            'legalName', 'tradeName', 'billingCity', 'billingState', 'billingAddress1',
            'billingAddress2', 'shippingCity', 'shippingState', 'shippingAddress1', 'shippingAddress2',
            'escalationContactName', 'salesContactName', 'bankName', 'branch',
            'bankAddress1', 'bankAddress2', 'bankCity', 'bankState', 'benificaryAccName', 'swift', 'intermediary',
            'name', 'designation', 'accContactName', 'escalationTelNo', 'escalationMno', 'escalationEmail',
            'salesTelNo', 'salesMno', 'salesEmail', 'accTelNo', 'accMno', 'accEmail'
        ];

        if (fieldsToCapitalize.includes(field)) {
            // let words = value?.toLowerCase()?.split(' ');
            // words = words.map(word => word.charAt(0)?.toUpperCase() + word?.slice(1));
            // value = words.join(' ');
            const isAllCaps = value === value.toUpperCase();
            if (!isAllCaps) {
                value = value.replace(/\b\w/g, (char, index) => {
                    if (index === 0 || value.charAt(index - 1) === ' ') {
                        return char.toUpperCase();
                    } else {
                        return char;
                    }
                });
            }
        }
        setVendorFormData(prevValues => ({
            ...prevValues,
            [field]: value
        }));
    };

    const notifyEmailAlert = (msg) => {
        toast.dismiss();
        toast.error(msg);
    };

    const showError = (errorMessage) => {
        toast.error(errorMessage);
    };

    const validateAllFields = () => {
        const fieldValidations = [
            () => validateAlphabets(vendorFormData?.legalName, 'legal name', showError),
            () => validateEmpty(vendorFormData?.tradeName, 'trade name', showError),
            () => validateSelectEmpty(vendorFormData?.companyType, 'company type', showError),
            () => validateDigits(vendorFormData?.telephoneNo, 'supplier telephone no', showError),
            () => validateEmpty(vendorFormData?.billingAddress1, 'billing address 1', showError),
            () => validateAlphabets(vendorFormData?.billingCity, 'billing address city', showError),
            () => validateAlphabets(vendorFormData?.billingState, 'billing address state', showError),
            () => validateSelectEmpty(vendorFormData?.billingCountry, 'billing address country', showError),
            () => validateDigits(vendorFormData?.billingZipCode, 'billing address zip code', showError),
        ];

        if (!isChecked) {
            fieldValidations.push(...[
                () => validateEmpty(vendorFormData?.shippingAddress1, 'shipping address line 1', showError),
                () => validateAlphabets(vendorFormData?.shippingCity, 'shipping address city', showError),
                () => validateAlphabets(vendorFormData?.shippingState, 'shipping address state', showError),
                () => validateSelectEmpty(vendorFormData?.shippingCountry, 'shipping address country', showError),
                () => validateDigits(vendorFormData?.shippingZipCode, 'shipping address zip code', showError),
            ])
        }

        // start validating all fields
        for (const validation of fieldValidations) {
            if (!validation()) {
                return false;
            }
        }

        if (!(msmeOption.yes || msmeOption.no)) {
            notifyEmailAlert('Please select whether you come under MSME?');
            return false;
        }

        if (!(gstOption.yes || gstOption.no)) {
            notifyEmailAlert('Please select whether you are registered under GST?');
            return false;
        }

        if (!(taxExemptionOption.yes || taxExemptionOption.no)) {
            notifyEmailAlert('Please select whether you come under Tax Exemptions?');
            return false;
        }

        if (gstOption.yes) {
            gstDetailsList?.forEach((gstDetails) => {
                fieldValidations.push(
                    () => validateEmpty(gstDetails?.taxCode, 'GST Code', showError),
                    () => validateEmpty(gstDetails?.taxState, 'GST State', showError),
                    () => validateGstNo(gstDetails.gstNo, 'GST No', showError),
                    () => validatePan(gstDetails.panNo, 'Supplier Pan No', showError, gstDetails.gstNo),
                    () => validateEmpty(gstDetails?.gstAddress, 'GST Address', showError)
                );
            });

            vendorServiceProviderList.forEach((serviceProvider) => {
                fieldValidations.push(
                    () => validateServiceAccgCode(serviceProvider?.serviceAccgCode, 'Accounting Code', showError),
                    () => validateSelectEmpty(serviceProvider?.gstRateExpected, 'GST Rate', showError),
                    () => validateEmpty(serviceProvider?.descOfServices, 'Description of Service', showError),
                    () => validateCompSchemeUnderGst(serviceProvider?.isCompSchemeUnderGst, 'Composition Scheme Under GST', showError)
                );
            });
        }

        fieldValidations.push(...[
            () => validateAlphabets(vendorFormData?.accContactName, 'account contact name', showError),
            () => validateEmail(vendorFormData?.accEmail, 'account email Id', showError),
            () => validateMobileNumber(vendorFormData?.accMno, 'account mobile No', showError),
            () => validateAlphabets(vendorFormData?.salesContactName, 'sales contact name', showError),
            () => validateEmail(vendorFormData?.salesEmail, 'sales email Id', showError),
            () => validateMobileNumber(vendorFormData?.salesMno, 'sales mobile No', showError),
            () => validateAlphabets(vendorFormData?.escalationContactName, 'Escalation name', showError),
            () => validateEmail(vendorFormData?.escalationEmail, 'escalation email Id', showError),
            () => validateMobileNumber(vendorFormData?.escalationMno, 'escalation mobile No', showError),
            () => validateBankName(vendorFormData?.bankName, 'bank name', showError),
            () => validateAlphabets(vendorFormData?.branch, 'branch', showError),
            () => validateIFSC(vendorFormData?.ifscCode, 'IFSC code', showError),
            () => validateAlphabets(vendorFormData?.benificaryAccName, 'beneficiary', showError),
            () => validateDigits(vendorFormData?.accNo, 'account no', showError),
            () => validateEmpty(vendorFormData?.bankAddress1, 'bank address 1', showError),
            () => validateAlphabets(vendorFormData?.bankCity, 'bank address city', showError),
            () => validateAlphabets(vendorFormData?.bankState, 'bank address state', showError),
            () => validateSelectEmpty(vendorFormData?.bankCountry, 'bank address country', showError),
            () => validateZipCode(vendorFormData?.bankZipCode, 'bank address zip code', showError),
            () => validateSelectEmpty(vendorFormData?.accCurrency, 'account currency', showError),
            () => validateEmpty(vendorFormData?.companyTurnOver, 'company turnover', showError),
        ])

        // start validating all fields
        for (const validation of fieldValidations) {
            if (!validation()) {
                return false;
            }
        }

        if (!(itrFilledOption.yes || itrFilledOption.no)) {
            notifyEmailAlert('Please select whether you have filled ITR');
            return false;
        }

        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(goodServices, 'text/html');

        // Count the number of list items within the <ol> element
        const listItems = htmlDoc.querySelectorAll('ol > li');

        // Count the number of <p> elements
        const paragraphs = htmlDoc.querySelectorAll('p');

        // Check if the number of list items and <p> elements are not equal to 10
        if (listItems?.length > 10 || paragraphs?.length > 10) {
            notifyEmailAlert('Please enter 10 or less than 10 core good services');
            return false;
        }

        fieldValidations.push(...[
            () => validateEmpty(goodServices, 'core good services', showError),
            () => validateEmpty(customer, 'major customer', showError),
        ])

        for (const validation of fieldValidations) {
            if (!validation()) {
                return false;
            }
        }

        if (msmeOption.yes) {
            if (!items.msmeCertificate) {
                notifyEmailAlert('Please check the MSME Certificate checkbox');
                return false;
            } else if (!fileInputs.msmeCertificate || !fileInputs.msmeCertificate.file) {
                notifyEmailAlert('Please upload the MSME Certificate document');
                return false;
            }
        }

        if (itrFilledOption.yes) {
            if (!items.itrCertificate) {
                notifyEmailAlert('Please check the ITR Certificate checkbox');
                return false;
            } else if (!fileInputs.itrCertificate || !fileInputs.itrCertificate.file) {
                notifyEmailAlert('Please upload the ITR Certificate document');
                return false;
            }
        }

        if (items.companyIncorporation) {
            if (!fileInputs.companyIncorporation || !fileInputs.companyIncorporation.file) {
                notifyEmailAlert('Please upload the Company Incorporation document');
                return false;
            }
        }

        if (items.cancelledCheque) {
            if (!fileInputs.cancelledCheque || !fileInputs.cancelledCheque.file) {
                notifyEmailAlert('Please upload the Cancelled Cheque document');
                return false;
            }
        }

        if (items.panCard) {
            if (!fileInputs.panCard || !fileInputs.panCard.file) {
                notifyEmailAlert('Please upload the Pan Card document');
                return false;
            }
        }

        if (items.gstCertificate) {
            if (!fileInputs.gstCertificate || !fileInputs.gstCertificate.file) {
                notifyEmailAlert('Please upload the Gst Certificate');
                return false;
            }
        }

        if (items.bankStatement) {
            if (!fileInputs.bankStatement || !fileInputs.bankStatement.file) {
                notifyEmailAlert('Please upload the Bank Statement document');
                return false;
            }
        }

        fieldValidations.push(...[
            () => validateAlphabets(vendorFormData?.name, 'declaration name', showError),
            () => validateAlphabets(vendorFormData?.designation, 'designation', showError),
        ])

        for (const validation of fieldValidations) {
            if (!validation()) {
                return false;
            }
        }

        return true;
    };

    const notifyErrorAlert = (msg) => {
        toast.dismiss();
        toast.error(msg);
    };

    const handleFormExport = async () => {
        try {
            const response = await fetch(Url.generatePdf.replace("{id}", sessionStorage.getItem('ID')), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log("Generate response:", response)
            if (response?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                openModal();
            } else {
                const wordBlob = await response.blob();
                const downloadUrl = URL.createObjectURL(wordBlob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'Vendor_Onboarding.pdf';
                link.click();
            }
        } catch (error) {
            console.error('Error while downloading Word file:', error);
        }
    }

    const convertDateToISOFormat = (dateString) => {
        const parts = dateString.split('-');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        // Construct the date in ISO format (yyyy-mm-dd)
        const isoDate = `${year}-${month}-${day}`;

        return isoDate;

    }
    console.log('veeeeeee', vendorFormData)
    const [saveStatus, setSaveStatus] = useState(false)
    const [errorMsg, seterrorMsg] = useState()
    const [isDisabled, setIsDisabled] = useState(false);
    const handleFormSaveAndDownload = (event) => {
        event.preventDefault();
        let obj = {
            vendorKycId: sessionStorage.getItem("ID") || localStorage.getItem("ID"),
            vendorDocumentAttachmentList: vendorDocumentAttachmentList,
            venderBankDetails: {
                bankName: vendorFormData.bankName,
                branch: vendorFormData.branch,
                beneficiaryAccName: vendorFormData.benificaryAccName,
                accountNo: vendorFormData.accNo,
                bankAddressLine1: vendorFormData.bankAddress1,
                bankAddressLine2: vendorFormData.bankAddress2,
                city: vendorFormData.bankCity,
                state: vendorFormData.bankState,
                zipCode: vendorFormData.bankZipCode,
                intermediaryBankDtl: vendorFormData.intermediary,
                accCurrency: vendorFormData.accCurrency,
                ifscCode: vendorFormData.ifscCode,
                swiftCode: vendorFormData.swift,
                companyTurnover: vendorFormData.companyTurnOver,
                isItrFiled: itrFilledOption.yes ? 'YES' : 'NO',
                countryMaster: {
                    countryId: vendorFormData.bankCountry
                }
            },
            gstdetailsList: gstOption.no ? null : gstDetailsList,
            vendorServiceProviderList: gstOption.no ? null : vendorServiceProviderList,
            tradeName: vendorFormData.tradeName,
            alternateNo: vendorFormData.telephoneNo,
            leagalName: vendorFormData.legalName,
            billingAddressLine1: vendorFormData.billingAddress1,
            billingAddressLine2: vendorFormData.billingAddress2,
            billingCity: vendorFormData.billingCity,
            billingState: vendorFormData.billingState,
            billingcountryMaster: {
                countryId: vendorFormData.billingCountry
            },
            shippingcountryMaster: {
                countryId: isChecked === true ? vendorFormData.billingCountry : vendorFormData.shippingCountry
            },
            billingZipCode: vendorFormData.billingZipCode,

            shippingAddressLine1: isChecked === true ? vendorFormData.billingAddress1 : vendorFormData.shippingAddress1,
            shippingAddressLine2: isChecked === true ? vendorFormData.billingAddress2 : vendorFormData.shippingAddress2,
            shippingCity: isChecked === true ? vendorFormData.billingCity : vendorFormData.shippingCity,
            shippingState: isChecked === true ? vendorFormData.billingState : vendorFormData.shippingState,
            shippingZipCode: isChecked === true ? vendorFormData.billingZipCode : vendorFormData.shippingZipCode,
            telephoneNo: vendorFormData.telephoneNo,
            isUnderTaxExemptions: taxExemptionOption.yes ? 'YES' : 'NO',
            isUnderGst: gstOption.yes ? 'YES' : 'NO',
            declName: vendorFormData.name,
            declDesignation: vendorFormData.designation,
            // onboardingDate: new Date(new Date(vendorFormData?.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })),
            onboardingDate: convertDateToISOFormat(vendorFormData?.date),
            escalationName: vendorFormData.escalationContactName,
            escalationTel: vendorFormData.escalationTelNo,
            escalationMobile: vendorFormData.escalationMno,
            escalationEmail: vendorFormData.escalationEmail,
            salesName: vendorFormData.salesContactName,
            salesTelNo: vendorFormData.salesTelNo,
            salesMobileNo: vendorFormData.salesMno,
            salesEmail: vendorFormData.salesEmail,
            accountsName: vendorFormData.accContactName,
            accountsTelNo: vendorFormData.accTelNo,
            accountsMobileNo: vendorFormData.accMno,
            accountsEmail: vendorFormData.accEmail,
            companyType: vendorFormData.companyType,
            isUnderMsme: msmeOption.yes ? 'YES' : 'NO',
            vendorMajorCustomerList: [
                {
                    "majorCustomer": customer
                }
            ],
            vendorCoreGoodServicesList: [
                {
                    "coreGoodsService": goodServices
                }
            ]
        }
        console.log("handleFormSaveAndDownload API", Url.vendorAddData, "\nobject", obj)

        if (!validateAllFields()) {
            setIsDisabled(false);
            return;
        } else if (!isDeclarationChecked) {
            showError('Please check the declaration box to proceed.');
            setIsDisabled(false);
            return;
        } else {
            setShowLoader(true)
            try {
                fetch(Url.vendorAddData, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
                    },
                    body: JSON.stringify(obj)
                }).then((resp) => resp.json())
                    .then((res) => {
                        setSaveStatus(true)
                        console.log("data submitted", res)
                        if (res?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                            setIsDisabled(false);
                            openModal();
                        } else {
                            if (res?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                                openModal();
                            } else {
                                if (res.SUCCESS === true) {
                                    setShowLoader(false)
                                    toast.success("Form Saved Successfully");
                                    setSubmittedStatus(true)
                                    handleFormExport()
                                    sessionStorage.setItem('submitStatus', true)
                                }
                                else if (res.SUCCESS === false) {
                                    setShowLoader(false)
                                    setSubmittedStatus(false)
                                    toast.error(res.httpStatus);
                                    seterrorMsg(res.httpStatus)
                                    setIsDisabled(false);
                                }
                            }
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        notifyErrorAlert(e)
                        setShowLoader(false)
                        setIsDisabled(false);
                    })
            }
            catch (e) {
                console.log(e);
                notifyErrorAlert(e)
                setShowLoader(false)
            }
        }
    }

    const [vendorDocumentAttachmentList, setVendorDocumentAttachmentList] = useState([]);
    useEffect(() => {
        if (fileInputs && typeof fileInputs === 'object' && Object.keys(fileInputs)?.length > 0) {
            let newVendorDocumentAttachmentList = [];
            Object.keys(fileInputs).forEach((key) => {
                const dataItem = fileInputs[key];
                if (dataItem !== null && typeof dataItem === 'object' && dataItem.filename !== null) {
                    const attachmentItem = {
                        fileName: dataItem.filename,
                        fileType: dataItem.filetype,
                        documentAttachment: dataItem.file,
                        vendorDocumentMaster: {
                            documentId: dataItem.id
                        }
                    };
                    newVendorDocumentAttachmentList.push(attachmentItem);
                }
            });

            if (fileInfo?.base64String != null) {
                const taxAttachmentItem = {
                    fileName: fileInfo.filename,
                    fileType: fileInfo.filetype,
                    documentAttachment: fileInfo.base64String,
                    vendorDocumentMaster: {
                        documentId: 7
                    }
                };
                newVendorDocumentAttachmentList.push(taxAttachmentItem);

            }

            setVendorDocumentAttachmentList(newVendorDocumentAttachmentList);

        }
    }, [fileInputs, fileInfo]);

    const initialVendorServiceProviderList = [{
        descOfServices: null,
        serviceAccgCode: null,
        gstRateExpected: null,
        isCompSchemeUnderGst: null
    }]
    const [vendorServiceProviderList, setVendorServiceProviderList] = useState(initialVendorServiceProviderList);

    const companyTypeList = [
        { id: 1, value: "Sole Proprietorship", label: "Sole Proprietorship" },
        { id: 2, value: "Partnership", label: "Partnership" },
        { id: 3, value: "Limited Liability Partnership", label: "Limited Liability Partnership" },
        { id: 4, value: "Private Limited Companies", label: "Private Limited Companies" },
        { id: 5, value: "Public Limited Companies", label: "Public Limited Companies" },
        { id: 6, value: "One - Person Company", label: "One - Person Company" },
        { id: 7, value: "Joint Venture", label: "Joint Venture" },
        { id: 8, value: "Non-Government Organisation", label: "Non-Government Organisation" }
    ]

    const GstRateExpectedList = [
        { id: 1, label: '5%', value: '5%' },
        { id: 2, label: '12%', value: '12%' },
        { id: 3, label: '18%', value: '18%' },
        { id: 4, label: '28%', value: '28%' },
    ]

    const handleInputValues2 = (index, key, value) => {
        const updatedList = vendorServiceProviderList.map((entry, i) =>
            i === index ? { ...entry, [key]: value } : entry
        );
        setVendorServiceProviderList(updatedList);
    };

    const handleCompCheckbox1 = (index, value) => {
        const updatedList = vendorServiceProviderList.map((entry, i) =>
            i === index ? { ...entry, isCompSchemeUnderGst: value } : entry
        );
        setVendorServiceProviderList(updatedList);
    };

    const handleAddServiceProviderField = () => {
        const prevGstDetails = vendorServiceProviderList || [];
        setVendorServiceProviderList([...prevGstDetails, initialVendorServiceProviderList]);
        setAddGstNew(true);
    }

    const handleRemoveServiceProviderField = (index) => {
        setVendorServiceProviderList((prevList) => {
            const newList = [...prevList];
            newList.splice(index, 1);
            return newList;
        })
    }

    const [getCountry, setGetcountry] = useState([])
    useEffect(() => {
        fetch(Url.getAllCountry, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((respone) => respone.json())
            .then((data) => {
                console.log("data country", data)
                if (data?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                    openModal();
                } else {
                    setGetcountry(data?.DATA)
                }
            });
    }, [])

    const handleAddressIcon = () => {
        setShippingAddresstoggle(!shippingAddressToggle)
    }

    // console.log("vendorDocumentAttachmentList", vendorDocumentAttachmentList)
    console.log("outside\nvendorformData", vendorFormData, "\ngstDetailsList", gstDetailsList, "vendorServiceProviderList", vendorServiceProviderList)

    const notifyUploadDocAlert = () => {
        toast.error('Please upload the sign document.');
    };
    
    const submitUploadedForm = () => {
        if (!fileUploadInfo?.documentAttachment) {
            notifyUploadDocAlert();
            return false;
        }
        else {
            let obj = {
                vendorKYC: {
                    vendorKycId: id
                },
                documentAttachment: fileUploadInfo?.documentAttachment,
                fileName: fileUploadInfo?.fileName,
                fileType: fileUploadInfo?.fileType,
                vendorDocumentMaster: {
                    documentId: 10
                }
            }
            setShowLoader(true)
            try {
                fetch(Url.uploadForm, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
                    },
                    body: JSON.stringify(obj)
                }).then((resp) => resp.json())
                    .then((res) => {
                        console.log("data submitted", res)
                        setShowLoader(false)
                        if (res?.MESSAGE?.toLowerCase()?.includes("token expired")) {
                            openModal();
                        } else {
                            if (res.SUCCESS === true) {
                                toast.success(res?.DATA);
                                setUploadedStatus(true)
                            }
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        notifyErrorAlert(e)
                    })
            }
            catch (e) {
                console.log(e);
                notifyErrorAlert(e)
            }
        }
    }

    const handleGstCheckbox = (option) => {
        if (option === 'yes') {
            setGstOption({ yes: true, no: false })
        }
        else {
            setGstOption({ yes: false, no: true })
            setGstDetailsList(initialGstDetailsList)
            setVendorServiceProviderList(initialVendorServiceProviderList)
        }
    }

    // console.log("VenderForm Api Data:", getVendorFormData)

    useEffect(() => {
        getVendorData()
    }, [submittedStatus, fetchAgain])

    const normalAttachments = documentAttachment?.filter(attachment => attachment.vendorDocumentMaster.documentId !== 6 && attachment.vendorDocumentMaster.documentId !== 10);
    const specialImageAttachment = documentAttachment?.find(attachment => attachment.vendorDocumentMaster.documentId === 6);

    const handleFileClick = (fileType, filePath) => {
        setSelectedFilePath(filePath);
        setSelectedFileType(fileType)
        setshowImgModal(true);
    };

    const handleCloseAddSuccModal = () => {
        setshowImgModal(false)
    }

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return new Date(`${year}-${month}-${day}`);
    };

    useEffect(() => {
        // Function to fetch bank details
        const fetchBankDetails = async () => {
            if (!vendorFormData?.ifscCode) {
                // If IFSC code is empty, reset bank details
                setVendorFormData(prevState => ({
                    ...prevState,
                    bankName: '',
                    branch: '',
                    bankAddress1: '',
                    bankCity: '',
                    bankState: '',
                    swift: '',
                    bankZipCode: ''
                }));
                return; // Exit early as there's no need to make the API call
            }
            try {
                const sanitizedIFSCCode = vendorFormData?.ifscCode.replace(/[^A-Z0-9]/g, '').toUpperCase();
                const response = await fetch(`https://ifsc.razorpay.com/${sanitizedIFSCCode}`, {
                    method: 'GET', // Specify the method
                });
                const data = await response.json();
                console.log("ddddd", data)
                const match = data?.ADDRESS?.match(/\b(\d+(\s+\d+)*?)\s*$/);;
                const lastNumbers = match ? match[0]?.trim() : '';
                setVendorFormData(prevState => ({
                    ...prevState,
                    bankName: data?.BANK,
                    branch: data?.BRANCH,
                    bankAddress1: data?.ADDRESS,
                    bankCity: data?.CITY,
                    bankState: data?.STATE,
                    swift: data?.SWIFT,
                    bankZipCode: lastNumbers,
                }));
            } catch (error) {
                console.log("error", error)
            }
        };

        fetchBankDetails();
    }, [vendorFormData?.ifscCode]);

    console.log('emptey', submittedStatus, vendorFormData)
    const [currencySign, setCurrencySign] = useState('');
    useEffect(() => {
        let sign = vendorFormData?.accCurrency?.split(' ');

        if (sign && sign.length > 1) {
            setCurrencySign(sign[1]);
        } else {
            setCurrencySign(''); // or set to a default value
        }
    }, [vendorFormData?.accCurrency]);
    let renderStatus = sessionStorage.getItem('renderStatus');
    return (
        <>
            <div className={atob(localStorage.getItem('isAdmin')) == 'admin'?"vendorFormMainDiv1":'vendorFormMainDiv'} key={getVendorFormData} style={{height : renderStatus || submittedFormStatus === true && atob(localStorage.getItem('isAdmin')) == 'admin' ? '81vh':'73vh' }}>
                <div className='vkycSubDiv'>
                    <div className='supplierFirstDiv'>
                        <div className='supplierHeaderBorderLine'>
                            <h1 className='supplierHeader'>Supplier Details</h1>
                        </div>
                    </div>
                    <div className='supplierSecondDiv'>
                        <div className='supplierSecondinnerDiv'>
                            <div className='kycFormDiv'>
                                <label>Legal Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true?
                                        <p className='commonparaStyle'>{getVendorFormData?.legalName}</p>
                                        : <input type='text' placeholder='Enter Name' value={vendorFormData.legalName} onChange={(e) => { handleInputValues('legalName', e); }} />
                                }
                            </div>
                            <div className='kycFormDiv'>
                                <label>Trade Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.tradeName}</p>
                                        : <input type='text' placeholder='Enter Trade Name' value={vendorFormData.tradeName} onChange={(e) => { handleInputValues('tradeName', e); }} />
                                }
                            </div>
                            <div className='kycFormDiv kycFormmargin'>
                                <label>Company Type</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.companyType}</p>
                                        : <select onChange={(e) => { handleInputValues('companyType', e); }} value={vendorFormData.companyType}>
                                            <option value=''>Select Company Type</option>
                                            {companyTypeList.map((value, i) => {
                                                return (
                                                    <option value={value.value}>{value.label}</option>
                                                );
                                            })}
                                        </select>
                                }
                            </div>
                            <div className='kycFormDiv kycFormmargin'>
                                <label>Telephone No</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.telephoneNo}</p>
                                        : <input type='text' placeholder='Enter Telephone No' value={vendorFormData.telephoneNo} onChange={(e) => { handleInputValues('telephoneNo', e); }} />
                                }

                            </div>
                        </div>
                        <div className='addressMainDiv'>
                            <h2 className='addressHeader' >Billing Address<span className='kycStar' style={{ color: "red" }}>*</span></h2>
                            <div className='addressInnerDiv'>
                                <div className='addressDivInput1'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>Address Line 1</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.billingAddress1}</p>
                                            </>
                                            : <textarea rows={3} placeholder='Address Line 1' value={vendorFormData.billingAddress1} onChange={(e) => { handleInputValues('billingAddress1', e); }} />
                                    }

                                </div>
                                {
                                    submittedFormStatus != true && (
                                        <div className='addressDivInput1'>
                                            <textarea rows={3} placeholder='Address Line 2' value={vendorFormData.billingAddress2} onChange={(e) => { handleInputValues('billingAddress2', e); }} />
                                        </div>
                                    )
                                }
                                {
                                    (submittedFormStatus === true && getVendorFormData.billingAddress2 != null) && (
                                        <div className='addressDivInput1'>

                                            <label>Address Line 2</label>
                                            <p className='commonparaStyle'>{getVendorFormData?.billingAddress2}</p>
                                        </div>
                                    )
                                }
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <><label>City</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.billingCity}</p>
                                            </>

                                            : <input type='text' placeholder='City' value={vendorFormData.billingCity} onChange={(e) => { handleInputValues('billingCity', e); }} style={{ color: '#060606' }} />
                                    }
                                </div>
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <><label>State</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.billingState}</p>
                                            </>

                                            : <input type='text' placeholder='State' value={vendorFormData.billingState} onChange={(e) => { handleInputValues('billingState', e); }} />
                                    }
                                </div>
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>Country</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.billingCountry}</p>
                                            </>

                                            : <select onChange={(e) => { handleInputValues('billingCountry', e); }} value={vendorFormData.billingCountry}>
                                                <option value=''>Select Country</option>
                                                {getCountry?.map((value, i) => {
                                                    return (
                                                        <option value={value.countryId}>{value.country}</option>
                                                    );
                                                })}
                                            </select>
                                    }
                                </div>
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>Zip Code</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.billingZipCode}</p>
                                            </>

                                            : <input type='text' placeholder='Zip Code' style={{ color: 'rgb(17 16 16)' }} value={vendorFormData.billingZipCode} onChange={(e) => { handleInputValues('billingZipCode', e); }} className='zipCodeInput' />
                                    }
                                </div>
                                {
                                    submittedFormStatus != true && (
                                        <div className="container">
                                            <span>Shipping Address Same As Billing Address</span>
                                            <label className="switch">
                                                <input type="checkbox" checked={isChecked} onChange={handleToggle} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {
                            (submittedFormStatus != true && isChecked === false) && (
                                <>
                                    <div
                                        className='checkbox-container1'
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleAddressIcon}
                                    >
                                        <span>Shipping Address<span className='kycStar' style={{ color: "red" }}>*</span></span>
                                        <div>
                                            {
                                                shippingAddressToggle ? <MdOutlineKeyboardArrowUp fill='#696969' /> : <MdKeyboardArrowDown fill='#696969' />
                                            }
                                        </div>
                                    </div>
                                    {shippingAddressToggle && (
                                        <div className='addressMainDiv'>
                                            <div className='addressInnerDiv'>
                                                <div className='addressDivInput1'>

                                                    <textarea rows={3} placeholder='Address Line 1' value={vendorFormData.shippingAddress1} onChange={(e) => { handleInputValues('shippingAddress1', e); }} />
                                                </div>
                                                <div className='addressDivInput1'>

                                                    <textarea rows={3} placeholder='Address Line 2' value={vendorFormData.shippingAddress2} onChange={(e) => { handleInputValues('shippingAddress2', e); }} />


                                                </div>
                                                <div className='addressDivInput'>
                                                    <input type='text' placeholder='City' value={vendorFormData.shippingCity} onChange={(e) => { handleInputValues('shippingCity', e); }} />


                                                </div>
                                                <div className='addressDivInput'>
                                                    <input type='text' placeholder='State' value={vendorFormData.shippingState} onChange={(e) => { handleInputValues('shippingState', e); }} />


                                                </div>
                                                <div className='addressDivInput'>
                                                    <select onChange={(e) => { handleInputValues('shippingCountry', e); }} value={vendorFormData.shippingCountry}>
                                                        <option value=''>Select Country</option>
                                                        {getCountry?.map((value, i) => {
                                                            return (
                                                                <option value={value.countryId}>{value.country}</option>
                                                            );
                                                        })}
                                                    </select>

                                                </div>
                                                <div className='addressDivInput'>
                                                    <input type='text' placeholder='Zip Code' style={{ color: 'rgb(22 21 21)' }} value={vendorFormData.shippingZipCode} onChange={(e) => { handleInputValues('shippingZipCode', e); }} className='zipCodeInput' />


                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </>
                            )
                        }
                        {
                            submittedFormStatus === true && (
                                <>
                                    <div className='checkbox-container1'>
                                        <span>Shipping Address<span style={{ color: "red" }}>*</span></span>
                                        {/* <div onClick={handleAddressIcon}>
                                            {
                                                shippingAddressToggle ? <MdOutlineKeyboardArrowUp fill='#696969' /> : <MdKeyboardArrowDown fill='#696969' />
                                            }

                                        </div> */}
                                    </div>
                                    {/* {shippingAddressToggle && (
                                       
                                )} */}
                                    {/* <div className='addressMainDiv'>
                                        <div className='addressInnerDiv'>
                                            <div className='addressDivInput1'>
                                                <label>Address Line 1</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.shippingAddress1}</p>
                                            </div>
                                            {
                                                getVendorFormData?.shippingAddress2 != null && (
                                                    <div className='addressDivInput1'>
                                                        <label>Address Line 2</label>
                                                        <p className='commonparaStyle'>{getVendorFormData?.shippingAddress2}</p>
                                                    </div>
                                                )
                                            }

                                            <div className='addressDivInput'>
                                                <label>City</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.shippingCity}</p>
                                            </div>
                                            <div className='addressDivInput'>
                                                <label>State</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.shippingState}</p>
                                            </div>
                                            <div className='addressDivInput'>
                                                <label>Country</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.shippingCountry}</p>
                                            </div>
                                            <div className='addressDivInput'>
                                                <>
                                                    <label>Zip Code</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.shippingZipCode}</p>
                                                </>
                                            </div>

                                        </div>
                                    </div> */}
                                    <VendorShippingAddress getVendorFormData={getVendorFormData} />
                                </>
                            )
                        }
                        {
                            submittedFormStatus != true && (
                                <div className="checkbox-container">
                                    <span>Do you come under MSME?<span style={{ color: "red" }}>*</span></span>
                                    <div className="options">
                                        <label className="option">
                                            <input
                                                type="checkbox"
                                                value={msmeOption.yes}
                                                checked={msmeOption.yes}
                                                onChange={() => handleMSMECheckbox('yes')} />
                                            Yes
                                        </label>
                                        <label className="option">
                                            <input
                                                type="checkbox"
                                                value={msmeOption.no}
                                                checked={msmeOption.no}
                                                onChange={() => handleMSMECheckbox('no')} />
                                            No
                                        </label>
                                    </div>
                                </div>
                            )
                        }
                        {
                            submittedFormStatus === true && (
                                <>
                                    <div className="checkbox-container">
                                        <span>Do you come under MSME?<span style={{ color: "red" }}>*</span></span>
                                        <div className="options">
                                            <p className='commonparaStyle'>{getVendorFormData.isUnderMsme}</p>
                                        </div>

                                    </div>
                                </>
                            )
                        }
                        {
                            submittedFormStatus != true && (
                                <>
                                    <div className="checkbox-container">
                                        <span>Are you registered under GST?<span style={{ color: "red" }}>*</span></span>
                                        <div className="options">
                                            <label className="option">
                                                <input
                                                    type="checkbox"
                                                    value={gstOption.yes}
                                                    checked={gstOption.yes}
                                                    onChange={() => handleGstCheckbox('yes')} />
                                                Yes
                                            </label>
                                            <label className="option">
                                                <input
                                                    type="checkbox"
                                                    value={gstOption.no}
                                                    checked={gstOption.no}
                                                    onChange={() => handleGstCheckbox('no')} />
                                                No
                                            </label>
                                        </div>
                                    </div>
                                    <div className="checkbox-container">
                                        <span>Do you come under Tax Exemptions?<span style={{ color: "red" }}>*</span></span>
                                        <div className="options">
                                            <label className="option">
                                                <input
                                                    type="checkbox"
                                                    value={taxExemptionOption.yes}
                                                    checked={taxExemptionOption.yes}
                                                    onChange={() => handleTaxCheckboxChange('yes')} />
                                                Yes
                                            </label>
                                            <label className="option">
                                                <input
                                                    type="checkbox"
                                                    value={taxExemptionOption.no}
                                                    checked={taxExemptionOption.no}
                                                    onChange={() => handleTaxCheckboxChange('no')} />
                                                No
                                            </label>
                                        </div>
                                    </div></>
                            )
                        }
                        {
                            submittedFormStatus === true && (
                                <div className="checkbox-container">
                                    <span>Are you registered under GST?<span style={{ color: "red" }}>*</span></span>
                                    <div className="options">
                                        <p className='commonparaStyle'>{getVendorFormData.isUnderGst}</p>
                                    </div>
                                </div>
                            )
                        }
                        {
                            submittedFormStatus === true && (
                                <div className="checkbox-container">
                                    <span>Do you come under Tax Exemptions?<span style={{ color: "red" }}>*</span></span>
                                    <div className="options">
                                        <p className='commonparaStyle'>{getVendorFormData.isUnderTaxExemptions}</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    (gstOption.yes === true && submittedFormStatus != true) && (
                        <>
                            <div className='vkycSubDiv'>
                                <div className='supplierFirstDiv' style={{ marginTop: '20px' }}>
                                    <div className='supplierHeaderBorderLine'>
                                        <h1 className='supplierHeader'>Tax Details</h1>
                                    </div>
                                </div>
                                <div className='taxSecondDiv'>
                                    <span style={{ color: 'grey', fontSize: '15px' }}>Tax Details<span style={{ color: 'red', marginBottom: '-5px' }}>*</span></span>
                                    {gstDetailsList?.map((entry, index) => (
                                        <>
                                            <div className='taxMainOuterDiv'>
                                                <div className='taxaddressInnerDiv' key={index}>
                                                    <div className='taxaddressDivInput'>
                                                        <input
                                                            type='text'
                                                            placeholder='Code'
                                                            value={entry.taxCode}
                                                            onChange={(e) => handleInputValues1(index, 'taxCode', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='taxaddressDivInput'>
                                                        <input
                                                            type='text'
                                                            placeholder='State'
                                                            value={entry.taxState}
                                                            onChange={(e) => handleInputValues1(index, 'taxState', e.target.value)}
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className='taxaddressDivInput'>
                                                        <input
                                                            type='text'
                                                            placeholder='GST No'
                                                            value={entry?.gstNo}
                                                            onChange={(e) => handleInputValues1(index, 'gstNo', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='taxaddressDivInput'>
                                                        <input
                                                            type='text'
                                                            placeholder='PAN No'
                                                            value={entry.panNo}
                                                            onChange={(e) => handleInputValues1(index, 'panNo', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='taxAddressDivInput1'>
                                                    <textarea
                                                        rows={3}
                                                        placeholder='Enter Address'
                                                        value={entry.gstAddress}
                                                        onChange={(e) => handleInputValues1(index, 'gstAddress', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='addGstDiv'>
                                                {
                                                    gstDetailsList?.length > 0 && gstDetailsList?.length == 1 ?
                                                        <>
                                                            <div className='addGstHeader' onClick={handleAddGSTField}> + Add</div>
                                                        </>
                                                        : gstDetailsList?.length == index + 1 && gstDetailsList?.length < 5 ?
                                                            <>
                                                                <div className='addGstHeader' onClick={() => handleRemoveGSTField(index)}> - Remove</div>
                                                                <div className='addGstHeader' onClick={handleAddGSTField}> + Add</div>
                                                            </>
                                                            : <>
                                                                <div className='addGstHeader' onClick={() => handleRemoveGSTField(index)}> - Remove</div>
                                                            </>
                                                }
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                            <div className='vkycSubDiv'>
                                <div className='supplierFirstDiv'>
                                    <div className='supplierHeaderBorderLine'>
                                        <h1 className='supplierHeader'>Details Of Service Provided</h1>
                                    </div>
                                </div>
                                <div className='serviceSecondDiv' >
                                    <span style={{ color: 'grey', fontSize: '15px' }}>Details Of Service Provided<span style={{ color: 'red', marginBottom: '-5px' }}>*</span></span>
                                    {vendorServiceProviderList?.map((entry, index) => (
                                        <>
                                            <div className='addressInnerDiv' key={index}>
                                                <div className='addressDivInput'>
                                                    <textarea
                                                        type='text'
                                                        placeholder='Service Accounting Code'
                                                        value={entry.serviceAccgCode}
                                                        onChange={(e) => handleInputValues2(index, 'serviceAccgCode', e.target.value)}
                                                        style={{ height: "35px", fontSize: "14px", color: "black" }}
                                                    />
                                                </div>
                                                <div className='addressDivInput'>
                                                    <select
                                                        value={entry.gstRateExpected}
                                                        onChange={(e) => handleInputValues2(index, 'gstRateExpected', e.target.value)}
                                                    >
                                                        <option value='' selected>Select GST Rate</option>
                                                        {GstRateExpectedList?.map((value, i) => (
                                                            <option key={i} value={value.value}>{value.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className='addressDivInput2'>
                                                    <textarea
                                                        type='text'
                                                        rows={3}
                                                        placeholder='Description Of Services'
                                                        value={entry.descOfServices}
                                                        onChange={(e) => handleInputValues2(index, 'descOfServices', e.target.value)}
                                                    />
                                                </div>
                                                <div className="checkbox-containerNew">
                                                    <span>Whether opted for composition scheme under GST?</span>
                                                    <div className="options">
                                                        <label className="option">
                                                            <input
                                                                type="checkbox"
                                                                checked={entry.isCompSchemeUnderGst === 'YES'}
                                                                onChange={(e) => handleCompCheckbox1(index, e.target.checked ? 'YES' : '')}
                                                            />
                                                            Yes
                                                        </label>
                                                        <label className="option">
                                                            <input
                                                                type="checkbox"
                                                                checked={entry.isCompSchemeUnderGst === 'NO'}
                                                                onChange={(e) => handleCompCheckbox1(index, e.target.checked ? 'NO' : '')}
                                                            />
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='addGstDiv'>
                                                {
                                                    vendorServiceProviderList?.length > 0 && vendorServiceProviderList?.length == 1 ?
                                                        <>
                                                            <div className='addGstHeader' onClick={handleAddServiceProviderField}> + Add</div>
                                                        </>
                                                        : vendorServiceProviderList?.length == index + 1 && vendorServiceProviderList?.length < 5 ?
                                                            <>
                                                                <div className='addGstHeader' onClick={() => handleRemoveServiceProviderField(index)}> - Remove</div>
                                                                <div className='addGstHeader' onClick={handleAddServiceProviderField}> + Add</div>
                                                            </>
                                                            : <>
                                                                <div className='addGstHeader' onClick={() => handleRemoveServiceProviderField(index)}> - Remove</div>
                                                            </>
                                                }
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    (submittedFormStatus === true && getVendorFormData.isUnderGst === 'YES') ?
                        <>
                            <div className='vkycSubDiv vkycfd'>
                                <div className='supplierFirstDiv vkycfd' style={{ marginTop: '20px' }}>
                                    <div className='supplierHeaderBorderLine vkycfd'>
                                        <h1 className='supplierHeader vkycfd'>Tax Details</h1>
                                    </div>
                                </div>
                                <div className='taxSecondDiv vkycfd'>
                                    <span style={{ color: 'grey', fontSize: '15px' }}>Tax Details<span style={{ color: 'red', marginBottom: '-5px' }}>*</span></span>
                                    {getGSTDetails?.map((entry, index) => (
                                        <div className='taxMainOuterDiv vkycfd'>
                                            <div className='taxaddressInnerDiv vkycfd' key={index}>
                                                <div className='taxaddressDivInput vkycfd'>
                                                    <label>Code</label>
                                                    <p className='commonparaStyle vkycfd'>{entry.vendorStateGSTCode.stateGstCode}</p>
                                                </div>
                                                <div className='taxaddressDivInput vkycfd'>
                                                    <label>State</label>
                                                    <p className='commonparaStyle vkycfd'>{entry.vendorStateGSTCode.state}</p>
                                                </div>
                                                <div className='taxaddressDivInput vkycfd'>
                                                    <label>GST No</label>
                                                    <p className='commonparaStyle vkycfd'>{entry.gstNo}</p>
                                                </div>
                                                <div className='taxaddressDivInput vkycfd'>
                                                    <label>Pan No</label>
                                                    <p className='commonparaStyle vkycfd'>{entry.panNo}</p>
                                                </div>

                                            </div>
                                            <div className='taxAddressDivInput1 vkycfd'>
                                                <label>Address</label>
                                                <p className='commonparaStyle vkycfd'>{entry.gstAddress}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='detailsOfService vkycfd'>
                                <div className='supplierFirstDiv vkycfd' style={{ marginTop: '0px' }}>
                                    <div className='supplierHeaderBorderLine vkycfd'>
                                        <h1 className='supplierHeader vkycfd'>Details Of Service Provided</h1>
                                    </div>
                                </div>
                                <div className='serviceSecondDiv vkycfd' >
                                    <span style={{ color: 'grey', fontSize: '15px' }}>Details Of Service Provided<span style={{ color: 'red', marginBottom: '-5px' }}>*</span></span>
                                    {serviceProvidedList?.map((entry, index) => (
                                        <div className='addressInnerDiv vkycfd' key={index}>
                                            <div className='addressDivInput vkycfd'>
                                                <label>Service Accounting Code</label>
                                                <p className='commonparaStyle vkycfd'>{entry.serviceAccgCode}</p>
                                            </div>
                                            <div className='addressDivInput vkycfd'>
                                                <label>GST Rate Expected</label>
                                                <p className='commonparaStyle vkycfd'>{entry.gstRateExpected}</p>
                                            </div>
                                            <div className='addressDivInput2 vkycfd'>
                                                <label>Description Of Service</label>
                                                <p className='commonparaStyle vkycfd'>{entry.descOfServices}</p>
                                            </div>
                                            <div className="checkbox-containerNew">
                                                <span>Whether opted for composition scheme under GST?</span>
                                                <div className="options">
                                                    <p className='commonparaStyle vkycfd'>{entry.isCompSchemeUnderGst}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                        : <></>
                }
                <hr className='vkycfHr vkycfd' />
                <div className='vkycSubDiv vkycfd'>
                    <div className='supplierFirstDiv vkycfd'>
                        <div className='supplierHeaderBorderLine vkycfd'>
                            <h1 className='supplierHeader vkycfd'>SPOC Details</h1>
                        </div>
                    </div>
                    <div className='contactSecondDiv vkycfd'>
                        <table className="contactTable">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Contact Name<span style={{ color: "red" }}>*</span></th>
                                    <th>Email ID<span style={{ color: "red" }}>*</span></th>
                                    <th>Mobile No<span style={{ color: "red" }}>*</span></th>
                                    <th>Telephone No</th>
                                    {/* {
                                        (getVendorFormData?.accTelNo != null || getVendorFormData?.salesTelNo != null || getVendorFormData?.escalationTelNo != null) && (
                                            <th>Telephone No</th>
                                        )
                                    } */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ backgroundColor: "#cecbcb" }}><span style={{ marginLeft: "11px" }}>Accounts</span></td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accContactName}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.accContactName} onChange={(e) => { handleInputValues('accContactName', e); }} style={{ textTransform: "capitalize" }} />
                                        }
                                    </td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accEmail}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.accEmail} onChange={(e) => { handleInputValues('accEmail', e); }} />
                                        }
                                    </td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accMno}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.accMno} onChange={(e) => { handleInputValues('accMno', e); }} />
                                        }
                                    </td>
                                    {
                                        submittedFormStatus != true && (
                                            <td>
                                                <textarea rows={3} className='text' value={vendorFormData?.accTelNo} onChange={(e) => { handleInputValues('accTelNo', e); }} />
                                            </td>
                                        )
                                    }
                                    {
                                        submittedFormStatus == true && (
                                            <td>
                                                {(getVendorFormData.accTelNo != null && getVendorFormData.accTelNo !== '') ? (
                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accTelNo}</p>
                                                ) : (
                                                    <p>N/A</p>
                                                )}
                                            </td>
                                        )
                                    }
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: "#cecbcb" }}><span style={{ marginLeft: "11px" }}>Sales</span></td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.salesContactName}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.salesContactName} onChange={(e) => { handleInputValues('salesContactName', e); }} style={{ textTransform: "capitalize" }} />
                                        }
                                    </td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.salesEmail}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.salesEmail} onChange={(e) => { handleInputValues('salesEmail', e); }} />
                                        }
                                    </td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.salesMno}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.salesMno} onChange={(e) => { handleInputValues('salesMno', e); }} />
                                        }
                                    </td>
                                    {
                                        submittedFormStatus != true && (
                                            <td>
                                                <textarea rows={3} className='text' value={vendorFormData?.salesTelNo} onChange={(e) => { handleInputValues('salesTelNo', e); }} />
                                            </td>
                                        )
                                    }
                                    {
                                        submittedFormStatus === true && (
                                            <td>
                                                {getVendorFormData?.salesTelNo ? (
                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData.salesTelNo}</p>
                                                ) : (
                                                    <p>N/A</p>
                                                )}
                                            </td>
                                        )
                                    }
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: "#cecbcb" }}><span style={{ marginLeft: "11px" }} >Escalation</span></td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.escalationContactName}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.escalationContactName} onChange={(e) => { handleInputValues('escalationContactName', e); }} style={{ textTransform: "capitalize" }} />
                                        }
                                    </td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.escalationEmail}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.escalationEmail} onChange={(e) => { handleInputValues('escalationEmail', e); }} />
                                        }
                                    </td>
                                    <td>
                                        {
                                            submittedFormStatus === true ?
                                                <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.escalationMno}</p>
                                                : <textarea rows={3} className='text' value={vendorFormData?.escalationMno} onChange={(e) => { handleInputValues('escalationMno', e); }} />
                                        }
                                    </td>
                                    {
                                        submittedFormStatus != true && (
                                            <td>
                                                <textarea rows={3} className='text' value={vendorFormData?.escalationTelNo} onChange={(e) => { handleInputValues('escalationTelNo', e); }} />
                                            </td>
                                        )
                                    }
                                    {
                                        submittedFormStatus === true && (
                                            <td>
                                                {getVendorFormData?.escalationTelNo ? (
                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData.escalationTelNo}</p>
                                                ) : (
                                                    <p>N/A</p>
                                                )}
                                            </td>
                                        )
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <hr className='vkycfHr vkycfd' style={{ margin: '15px 30px 20px 30px' }} />
                <div className='vkycSubDiv vkycfd'>
                    <div className='supplierFirstDiv vkycfd'>
                        <div className='supplierHeaderBorderLine vkycfd'>
                            <h1 className='supplierHeader vkycfd'>Financial Details</h1>
                        </div>
                    </div>
                    <div className='financialSecondDiv vkycfd'>
                        <div className='benifiAccNoDiv vkycfd'>
                            <div className='kycFormDiv vkycfd'>
                                <label>IFSC Code</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.ifscCode}</p>
                                        : <input type='text' placeholder='Enter IFSC Code' value={vendorFormData.ifscCode} onChange={(e) => { handleInputValues('ifscCode', e); }} />
                                }
                            </div>
                            <div className='kycFormDiv'>
                                <label>Bank Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.bankName}</p>
                                        : <input type='text' placeholder='Enter Bank Name' value={vendorFormData.bankName} onChange={(e) => { handleInputValues('bankName', e); }} />
                                }
                            </div>
                            <div className='kycFormDiv'>
                                <label>Branch</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.branch}</p>
                                        : <input type='text' placeholder='Enter Branch' value={vendorFormData.branch} onChange={(e) => { handleInputValues('branch', e); }} />
                                }
                            </div>
                        </div>
                        <div className='benifiAccNoDiv'>
                            <div className='benifiAccNokycFormDiv kycFormmargin1'>
                                <label>Beneficiary Account Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.benificaryAccName}</p>
                                        : <input type='text' placeholder='Enter Beneficiary Account Name' value={vendorFormData.benificaryAccName} onChange={(e) => { handleInputValues('benificaryAccName', e); }} />
                                }
                            </div>
                            <div className='benifiAccNokycFormDiv kycFormmargin1'>
                                <label>Account No</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.accNo}</p>
                                        : <input type='text' placeholder='Enter Account No' value={vendorFormData.accNo} onChange={(e) => { handleInputValues('accNo', e); }} />
                                }
                            </div>
                        </div>
                        <div className='kycFormDiv2 kycFormmargin1' style={{ marginBottom: '-10px' }}>
                            <label>Bank Address</label><span className='kycStar' style={{ color: "red" }}>*</span>
                        </div>
                        <div className='addressMainDiv'>
                            <div className='addressInnerDiv'>
                                <div className='addressDivInput1'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>Address Line 1</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.bankAddress1}</p>
                                            </>
                                            : <textarea rows={3} placeholder='Address Line 1' value={vendorFormData.bankAddress1} onChange={(e) => { handleInputValues('bankAddress1', e); }} />
                                    }
                                </div>
                                {
                                    submittedFormStatus != true && (
                                        <div className='addressDivInput1'>
                                            {
                                                submittedFormStatus ?
                                                    <>
                                                        <label>Address Line 2</label>
                                                        <p className='commonparaStyle'>{getVendorFormData?.bankAddress2}</p>
                                                    </>

                                                    : <textarea rows={3} placeholder='Address Line 2' value={vendorFormData.bankAddress2} onChange={(e) => { handleInputValues('bankAddress2', e); }} />
                                            }
                                        </div>
                                    )
                                }
                                {
                                    (submittedFormStatus === true && getVendorFormData.bankAddress2 != null) && (
                                        <div className='addressDivInput1'>
                                            <label>Address Line 2</label>
                                            <p className='commonparaStyle'>{getVendorFormData?.bankAddress2}</p>
                                        </div>
                                    )
                                }
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>City</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.bankCity}</p>
                                            </>

                                            : <input type='text' placeholder='City' value={vendorFormData.bankCity} onChange={(e) => { handleInputValues('bankCity', e); }} />
                                    }
                                </div>
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>State</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.bankState}</p>
                                            </>

                                            : <input type='text' placeholder='State' value={vendorFormData.bankState} onChange={(e) => { handleInputValues('bankState', e); }} />
                                    }
                                </div>
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>Country</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.bankCountry}</p>
                                            </>

                                            : <select onChange={(e) => { handleInputValues('bankCountry', e); }} value={vendorFormData.bankCountry}>
                                                <option value=''>Select Country</option>
                                                {getCountry?.map((value, i) => {
                                                    return (
                                                        <option value={value.countryId}>{value.country}</option>
                                                    );
                                                })}
                                            </select>
                                    }
                                </div>
                                <div className='addressDivInput'>
                                    {
                                        submittedFormStatus === true ?
                                            <>
                                                <label>Zip code</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.bankZipCode}</p>
                                            </>

                                            : <input type='text' placeholder='Zip Code' style={{ color: 'rgb(22 21 21)' }} value={vendorFormData.bankZipCode} onChange={(e) => { handleInputValues('bankZipCode', e); }} className='zipCodeInput' />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='benifiAccNoDiv kycFormmargin1'>
                            <div className='benifiAccNokycFormDiv'>
                                <label>Account Currency</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.accCurrency}</p>
                                        : <select value={vendorFormData.accCurrency} onChange={(e) => { handleInputValues('accCurrency', e); }}>
                                            {currencyList.map((value) => {
                                                return (
                                                    <option value={value.value}>{value.label}</option>
                                                );
                                            })}
                                        </select>
                                }
                            </div>
                            {
                                submittedFormStatus != true && (
                                    <div className='benifiAccNokycFormDiv'>
                                        <label>SWIFT (mandatory in foreign payment)</label>
                                        {
                                            submittedStatus ?
                                                <p className='commonparaStyle'>{getVendorFormData?.swift}</p>
                                                : <input type='text' placeholder='Enter SWIFT ' value={vendorFormData.swift} onChange={(e) => { handleInputValues('swift', e); }} />
                                        }
                                    </div>
                                )
                            }
                            {
                                (submittedFormStatus === true && getVendorFormData?.swift != null) && (
                                    <div className='benifiAccNokycFormDiv'>
                                        <label>SWIFT (mandatory in foreign payment)</label>
                                        <p className='commonparaStyle'>{getVendorFormData?.swift}</p>
                                    </div>
                                )
                            }
                        </div>
                        {
                            submittedFormStatus != true && (
                                <div className='benifiAccNoDiv kycFormmargin1'>
                                    <div className='benifiAccNokycFormDiv1'>
                                        <label>Intermediary Bank Details(if applicable) </label>
                                        {
                                            submittedFormStatus ?
                                                <p className='commonparaStyle'>{getVendorFormData?.intermediary}</p>
                                                : <input type='text' placeholder='Enter Intermediary Bank Details' value={vendorFormData.intermediary} onChange={(e) => { handleInputValues('intermediary', e); }} />
                                        }
                                    </div>
                                </div>
                            )
                        }
                        {
                            (submittedFormStatus === true && getVendorFormData?.intermediary != null) && (
                                <div className='benifiAccNoDiv kycFormmargin1'>
                                    <div className='benifiAccNokycFormDiv1'>
                                        <label>Intermediary Bank Details(if applicable) </label>
                                        <p className='commonparaStyle'>{getVendorFormData?.intermediary}</p>
                                    </div>
                                </div>
                            )
                        }
                        <div className='checkbox-container2 kycFormmargin1'>
                            <span className='companyTrunOverDiv'>Company Turnover<span style={{ color: "red" }}>*</span></span>
                            {
                                submittedFormStatus === true ?
                                    <div className="options">
                                        <p className='commonparaStyle'>{currencySign} {getVendorFormData?.companyTurnOver}</p>
                                    </div>

                                    : <div className="input-container">{
                                        currencySign !== '' && (
                                            <span className="input-prefix">{currencySign}</span>
                                        )
                                    }

                                        <input
                                            className='companyTurnOver'
                                            type="text"
                                            placeholder="Enter Company Turnover"
                                            value={vendorFormData.companyTurnOver}
                                            onChange={(e) => { handleInputValues('companyTurnOver', e); }}
                                        />
                                    </div>
                            }
                        </div>
                        {
                            submittedFormStatus != true && (
                                <div className="checkbox-container kycFormmargin1">
                                    <span>ITR Filled?<span style={{ color: "red" }}>*</span></span>
                                    <div className="options">
                                        <label className="option">
                                            <input
                                                type="checkbox"
                                                value={itrFilledOption.yes}
                                                checked={itrFilledOption.yes}
                                                onChange={() => handleITRCheckbox('yes')} />
                                            Yes
                                        </label>
                                        <label className="option">
                                            <input
                                                type="checkbox"
                                                value={itrFilledOption.no}
                                                checked={itrFilledOption.no}
                                                onChange={() => handleITRCheckbox('no')} />
                                            No
                                        </label>
                                    </div>
                                </div>
                            )
                        }
                        {
                            submittedFormStatus === true && (
                                <div className="checkbox-container kycFormmargin1">
                                    <span>ITR Filled?<span style={{ color: "red" }}>*</span></span>
                                    <div className="options">
                                        <p className='commonparaStyle'>{getVendorFormData?.isItrFiled}</p>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </div>
                <hr className='vkycfHr' />
                <div className='vkycSubDiv'>
                    <div className='supplierFirstDiv'>
                        <div className='supplierHeaderBorderLine'>
                            <h1 className='supplierHeader'>Top core Goods/Services offered</h1>
                        </div>
                    </div>
                    <div className='goodServiceSecondDiv'>
                        <span style={{ color: 'grey', fontSize: '15px' }}>Top core Goods/Services offered<span style={{ color: 'red' }}>*</span></span>
                        {
                            submittedFormStatus === true ?
                                // getCoreGoodServies?.map((item) => {
                                //     return (<p className='commonparaStyle'>{item?.coreGoodsService}</p>)

                                // })
                                <ReactQuill
                                    value={getCoreGoodServies[0]?.coreGoodsService}
                                    // onChange={handleGoodService}
                                    // placeholder='Enter Answer'
                                    modules={modules}
                                    readOnly={true}
                                    className="custom-quill"
                                />
                                : <>
                                    <ReactQuill
                                        value={goodServices}
                                        onChange={handleGoodService}
                                        placeholder='Enter Answer'
                                        modules={modules}
                                        className="custom-quill"
                                    />
                                </>
                        }
                    </div>
                    <hr className='vkycfHr' />
                    <div className='vkycSubDiv'>
                        <div className='supplierFirstDiv'>
                            <div className='supplierHeaderBorderLine'>
                                <h1 className='supplierHeader'>Major Customers</h1>
                            </div>
                        </div>
                        <div className='majorcustomerSecondDiv'>
                            <span style={{ color: 'grey', fontSize: '15px' }}>Major Customers<span style={{ color: 'red' }}>*</span></span>
                            {
                                submittedFormStatus === true ?
                                    // getMajorCustomers?.map((item) => {
                                    //     return (
                                    //         <p className='commonparaStyle'>{item.majorCustomer}</p>
                                    //     )
                                    // })
                                    <ReactQuill
                                        value={getMajorCustomers[0]?.majorCustomer}
                                        // onChange={handleCustomer}
                                        // placeholder='Enter Answer'
                                        modules={modules}
                                        readOnly={true}
                                        className="custom-quill"
                                    />
                                    :
                                    <ReactQuill
                                        value={customer}
                                        onChange={handleCustomer}
                                        placeholder='Enter Answer'
                                        modules={modules}
                                        className="custom-quill"
                                    />
                            }
                        </div>
                    </div>
                </div>
                {
                    submittedFormStatus != true && (<>
                        <hr className='vkycfHr' />
                        <div className='vkycSubDiv'>
                            <div className='supplierFirstDiv'>
                                <div className='supplierHeaderBorderLine'>
                                    <h1 className='supplierHeader'>Documentation Details</h1>
                                </div>
                            </div>
                            <div className='docDetailsSecondDiv'>
                                <div className='docDetailsInner1'>
                                    <div className='docLabels'>
                                        <div className='docInnerfirstDiv'>
                                            <input
                                                type="checkbox"
                                                style={{ width: '11px',cursor:'pointer' }}
                                                checked={items.companyIncorporation}
                                                value='Company Incorporation'
                                                onChange={(e) => handleCheckboxChange('companyIncorporation', e)} />
                                            <span>Company Incorporation Document</span>
                                        </div>
                                        <div className='docInnerSecondDiv'>
                                            {items.companyIncorporation && (
                                                <>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id="fileInput"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileInputChange(1, 'companyIncorporation', e)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className='docChooseFile'
                                                            onClick={() => document.getElementById('fileInput').click()}
                                                        >
                                                            Choose File
                                                        </button>
                                                        {
                                                            fileInputs?.companyIncorporation?.filename != null && (
                                                                <span>{fileInputs?.companyIncorporation?.filename.length > 24 ? fileInputs?.companyIncorporation?.filename.substring(0, 24) + "..." : fileInputs?.companyIncorporation?.filename}</span>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='docDetailsInner1'>
                                    <div className='docLabels'>
                                        <div className='docInnerfirstDiv'>
                                            <input
                                                type="checkbox"
                                                style={{ width: '11px' }}
                                                checked={items.cancelledCheque}
                                                value='Cancelled Cheque'
                                                onChange={(e) => handleCheckboxChange('cancelledCheque', e)} />
                                            <span>Cancelled Cheque/ Bank Letter Statement</span>
                                        </div>
                                        <div className='docInnerSecondDiv'>
                                            {items.cancelledCheque && (
                                                <>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id="fileInput1"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileInputChange(2, 'cancelledCheque', e)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className='docChooseFile'
                                                            onClick={() => document.getElementById('fileInput1').click()}
                                                        >
                                                            Choose File
                                                        </button>

                                                        {
                                                            fileInputs?.cancelledCheque?.filename != null && (
                                                                <span>{fileInputs?.cancelledCheque?.filename.length > 24 ? fileInputs?.cancelledCheque?.filename.substring(0, 24) + "..." : fileInputs?.cancelledCheque?.filename}</span>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='docDetailsInner1'>
                                    <div className='docLabels'>
                                        <div className='docInnerfirstDiv'>
                                            <input
                                                type="checkbox"
                                                style={{ width: '11px' }}
                                                checked={items.panCard}
                                                value='Pan card'
                                                onChange={(e) => handleCheckboxChange('panCard', e)} />
                                            <span>Pan Card</span>
                                        </div>
                                        <div className='docInnerSecondDiv'>
                                            {items.panCard && (
                                                <>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id="fileInput2"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileInputChange(3, 'panCard', e)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className='docChooseFile'
                                                            onClick={() => document.getElementById('fileInput2').click()}
                                                        >
                                                            Choose File
                                                        </button>
                                                        {
                                                            fileInputs?.panCard?.filename != null && (
                                                                <span>{fileInputs?.panCard?.filename.length > 24 ? fileInputs?.panCard?.filename.substring(0, 24) + "..." : fileInputs?.panCard?.filename}</span>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='docDetailsInner1'>
                                    <div className='docLabels'>
                                        <div className='docInnerfirstDiv'>
                                            <input
                                                type="checkbox"
                                                style={{ width: '11px' }}
                                                checked={items.gstCertificate}
                                                onChange={(e) => handleCheckboxChange('gstCertificate', e)}
                                                value='Gst Certificate' />
                                            <span>GST Certificate</span>
                                        </div>
                                        <div className='docInnerSecondDiv'>
                                            {items.gstCertificate && (
                                                <>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id="fileInput3"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileInputChange(4, 'gstCertificate', e)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className='docChooseFile'
                                                            onClick={() => document.getElementById('fileInput3').click()}
                                                        >
                                                            Choose File
                                                        </button>
                                                        {
                                                            fileInputs?.gstCertificate?.filename != null && (
                                                                <span>{fileInputs?.gstCertificate?.filename.length > 24 ? fileInputs?.gstCertificate?.filename.substring(0, 24) + "..." : fileInputs?.gstCertificate?.filename}</span>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='docDetailsInner1'>
                                    <div className='docLabels'>
                                        <div className='docInnerfirstDiv'>
                                            <input
                                                type="checkbox"
                                                style={{ width: '11px' }}
                                                checked={items.bankStatement}
                                                value='Bank Statement'
                                                onChange={(e) => handleCheckboxChange('bankStatement', e)} />
                                            <span>Last 3 Month Bank Statement</span>
                                        </div>
                                        <div className='docInnerSecondDiv'>
                                            {items.bankStatement && (
                                                <>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id="fileInput4"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileInputChange(5, 'bankStatement', e)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className='docChooseFile'
                                                            onClick={() => document.getElementById('fileInput4').click()}
                                                        >
                                                            Choose File
                                                        </button>

                                                        {
                                                            fileInputs?.bankStatement?.filename != null && (
                                                                <span>{fileInputs?.bankStatement?.filename.length > 24 ? fileInputs?.bankStatement?.filename.substring(0, 24) + "..." : fileInputs?.bankStatement?.filename}</span>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {msmeOption.yes && (
                                    <div className='docDetailsInner1'>
                                        <div className='docLabels'>
                                            <div className='docInnerfirstDiv'>
                                                <input
                                                    type="checkbox"
                                                    style={{ width: '11px' }}
                                                    checked={items.msmeCertificate}
                                                    value='MSME Certificate'
                                                    onChange={(e) => handleCheckboxChange('msmeCertificate', e)} />
                                                <span>MSME Certificate</span>
                                            </div>
                                            <div className='docInnerSecondDiv'>
                                                {items.msmeCertificate && (
                                                    <>
                                                        <div>
                                                            <input
                                                                type="file"
                                                                id="fileInput5"
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => handleFileInputChange(8, 'msmeCertificate', e)}
                                                            />
                                                            <button
                                                                type="button"
                                                                className='docChooseFile'
                                                                onClick={() => document.getElementById('fileInput5').click()}
                                                            >
                                                                Choose File
                                                            </button>

                                                            {
                                                                fileInputs?.msmeCertificate?.filename != null && (
                                                                    <span>{fileInputs?.msmeCertificate?.filename.length > 24 ? fileInputs?.msmeCertificate?.filename.substring(0, 24) + "..." : fileInputs?.msmeCertificate?.filename}</span>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {itrFilledOption.yes && (
                                    <div className='docDetailsInner1'>
                                        <div className='docLabels'>
                                            <div className='docInnerfirstDiv'>
                                                <input
                                                    type="checkbox"
                                                    style={{ width: '11px' }}
                                                    checked={items.itrCertificate}
                                                    value='ITR Certificate'
                                                    onChange={(e) => handleCheckboxChange('itrCertificate', e)} />
                                                <span>ITR Certificate</span>
                                            </div>
                                            <div className='docInnerSecondDiv'>
                                                {items.itrCertificate && (
                                                    <>
                                                        <div>
                                                            <input
                                                                type="file"
                                                                id="fileInput6"
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => handleFileInputChange(9, 'itrCertificate', e)}
                                                            />
                                                            <button
                                                                type="button"
                                                                className='docChooseFile'
                                                                onClick={() => document.getElementById('fileInput6').click()}
                                                            >
                                                                Choose File
                                                            </button>
                                                            {
                                                                fileInputs?.itrCertificate?.filename != null && (
                                                                    <span>{fileInputs?.itrCertificate?.filename.length > 24 ? fileInputs?.itrCertificate?.filename.substring(0, 24) + "..." : fileInputs?.itrCertificate?.filename}</span>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                    )
                }
                {
                    (submittedFormStatus === true && normalAttachments?.length > 0) && (
                        <div className='vkycSubDiv vkycfd' style={{ marginTop: '10px' }}>
                            <div className='supplierFirstDiv vkycfd'>
                                <div className='supplierHeaderBorderLine vkycfd'>
                                    <h1 className='supplierHeader vkycfd'>Uploaded Documents</h1>
                                </div>
                            </div>
                            <div className='docDetailsSecondDiv vkycfd'>
                                {normalAttachments?.map((attachment, index) => (
                                    <div className='docDetailsInner1 vkycfd' style={{ padding: '5px 0', border: '1px solid #C22457' }}>
                                        <label className='docLabels vkycfd'>
                                            <div>
                                                <div>
                                                    <div key={index} data-index={index}>
                                                        <a
                                                            style={{ fontSize: '15px', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                                                            onClick={() => handleFileClick(attachment.fileType, attachment.documentAttachment)}
                                                        > <span style={{ marginRight: '5px' }}>{index + 1}.</span>{attachment.vendorDocumentMaster.documentType}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
                <hr className='vkycfHr vkycfd' />
                <div className='vkycSubDiv vkycfd'>
                    <div className='supplierFirstDiv2 vkycfd'>
                        <div className='supplierHeaderBorderLine vkycfd'>
                            <h1 className='supplierHeader vkycfd'>Declaration (Authorised Supplier’s Representative and Approved Signatory) </h1>
                        </div>
                    </div>
                    <div className='declSecondDiv vkycfd'>
                        <div className='kycHeadingDiv vkycfd'>
                            <p>
                                <input type='checkbox' checked={isDeclarationChecked || submittedFormStatus} onChange={(e) => setIsDeclarationChecked(e.target.checked)} style={{ marginRight: '10px' }} disabled={submittedStatus} />
                                I hereby declare that, to the best of my knowledge, the information furnished in this form is true and correct in every respect.<span style={{ color: "red" }}>*</span>
                            </p>
                        </div>
                        <div className='decInnerDiv'>
                            <div className='vkycfDeclarationDiv'>
                                <label>Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.name}</p>
                                        : <input type='text' placeholder='Enter Name' value={vendorFormData.name} onChange={(e) => { handleInputValues('name', e); }} />
                                }
                            </div>
                            <div className='vkycfDeclarationDiv'>
                                <label>Designation</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                {
                                    submittedFormStatus === true ?
                                        <p className='commonparaStyle'>{getVendorFormData?.designation}</p>
                                        : <input type='text' placeholder='Enter Designation' value={vendorFormData.designation} onChange={(e) => { handleInputValues('designation', e); }} />
                                }
                            </div>
                            <div className='vkycfDeclarationDiv'>
                                <label>Date</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                <DatePicker
                                    className='datepicker'
                                    // selected={vendorFormData?.date}
                                    value={vendorFormData?.date}
                                    dateFormat='dd-MM-yyyy'
                                    placeholderText='dd-MM-yyyy'
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='vkycfHr' />
                { atob(localStorage.getItem('isAdmin')) == 'admin'  ? <></> :
                        <div className='vendormainButtonDiv1' style={{ display: uploadedStatus === true ? 'none' : 'block' }}>
                            {
                                submittedFormStatus === true &&
                                <div className='uploadMainDivOuter'>
                                    <div className="upload-container"
                                        style={{ cursor: sessionRole?.includes('CustomerFeedBackAdmin') ? 'not-allowed' : 'pointer' }}
                                        title='Uploading is restricted for admin!'
                                    >
                                        <div className="upload-form"
                                            style={{ cursor: sessionRole?.includes('CustomerFeedBackAdmin') ? 'not-allowed' : 'pointer' }}
                                            title='Uploading is restricted for admin!'
                                        >
                                            <label htmlFor="fileInput" className="upload-label"
                                                style={{ cursor: sessionRole?.includes('CustomerFeedBackAdmin') ? 'not-allowed' : 'pointer' }}
                                                title='Uploading is restricted for admin!'
                                                >
                                                <img src={upload} alt="Upload Icon" className="upload-icon"
                                                    style={{ cursor: sessionRole?.includes('CustomerFeedBackAdmin') ? 'not-allowed' : 'pointer' }}
                                                    title='Uploading is restricted for admin!'
                                                />
                                                        <span className='uploadText'
                                                            style={{ cursor: sessionRole?.includes('CustomerFeedBackAdmin') ? 'not-allowed' : 'pointer' }}
                                                            title='Uploading is restricted for admin!'
                                                        >Upload Signed Form</span>
                                            </label> 
                                            <input
                                                type="file"
                                                id="fileInput"
                                                name="file"
                                                className="file-input"
                                                onChange={handleFileChange}
                                                disabled={sessionRole?.includes('CustomerFeedBackAdmin')}
                                            />
                                        </div>
                                    </div>
                                    {
                                        fileUploadInfo?.documentAttachment != '' && (
                                            <span style={{ fontSize: '13px', color: '#C22457' }}>{fileUploadInfo?.fileName}</span>
                                        )
                                    }
                                </div>
                            }
                        </div> 
                }


                <ReactModal
                    isOpen={showSuccessModal}
                    contentLabel="Minimal Modal Example"
                    className="customerFormModal customerFormModalHeightBug modalRes"
                    overlayClassName="customerFormOverlay"
                    ariaHideApp={false}
                    shouldCloseOnOverlayClick={false}
                    onRequestClose={handleCloseSuccModal}
                >
                    <div className="customerFormdelete_close">
                        <img
                            src={cancel_btn}
                            alt="cancel-btn"
                            onClick={handleCloseSuccModal}
                            style={{ width: "30px" }}
                        ></img>
                    </div>
                </ReactModal>
                <ToastContainer rtl />
            </div>
            {
                submittedFormStatus != true &&
                <div className='vendormainButtonDiv'>

                    <button className='nextButton' onClick={() => {
                        navigate(`/app/KYCGetStarted/${btoa(sessionStorage.getItem("ID"))}`)
                    }}>
                        Back</button>
                    <button className='nextButton' onClick={errorMsg === 'INTERNAL_SERVER_ERROR' ? null : handleFormSaveAndDownload} style={{ cursor: submittedStatus === false ? 'not-allowed' : 'pointer' }}
                        disabled={isDisabled} >Save & Download</button></div>
            }
            {console.log('submittedformstaus',submittedFormStatus,!sessionRole?.includes('CustomerFeedBackAdmin'))}
            {
                (submittedFormStatus === true && !sessionRole?.includes('CustomerFeedBackAdmin')) && (
                    <div className='vendormainButtonDiv2' style={{ display: uploadedStatus === true ? 'none' : 'block' }}>
                        {atob(localStorage.getItem('isAdmin')) == 'admin' ? <></> :
                            <button className='nextButton' onClick={submitUploadedForm}>Submit</button>
                        }
                    </div>
                )
            }
            <ReactModal isOpen={showImgModal} contentLabel="Minimal Modal Example"
                className="vendorFillModal vendorFillModal modalRes" overlayClassName="vendorFillOverlay"
                ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseAddSuccModal} >
                <div className="delete_close">
                    <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseAddSuccModal} style={{ width: "30px" }} />
                </div>
                <div className="HeroDiv MsgDiv">
                    {selectedFileType === 'application/pdf' ? (
                        <div style={{ width: '100%', cursor: 'pointer' }}>
                            <iframe
                                src={selectedFilePath}
                                style={{ width: '800px', height: '400px' }}
                            />
                        </div>
                    ) : (
                        <img
                            src={selectedFilePath}
                            alt="Selected File"
                            style={{ width: '100%', height: '400px', border: '1px solid black' }}
                        />
                    )}
                </div>
            </ReactModal>
            <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
                overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
                <Lottie animationData={Loader} style={style} />
            </ReactModal>
        </>
    )
}

export default VendorKYCForm