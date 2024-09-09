import React, { useContext, useEffect, useState } from 'react'
import { Url } from '../../Constants/APIUrlConstant'
import './VendorFillForm.css'
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import cancel_btn from "../../CustomerFeedback/Assets/cancel.svg";
import ReactModal from "react-modal";
import DatePicker from 'react-datepicker';
import CommonVendor from '../../CommonComponents/CommonVendor';
import VendorShippingAddress from '../../CommonComponents/VendorShippingAddress';
import { contextData } from '../../Context/MyContext';

const VendorFillForm = () => {
    const navigate = useNavigate();
    const { isDeclarationChecked, setIsDeclarationChecked } = useContext(contextData)
    const [GSTDetails, setGSTDetails] = useState([])
    const [serviceProvidedDetails, setServiceProvidedDetails] = useState([])
    const [getCoreGood, setCoreGood] = useState([])
    const [getMajorCustomer, setMajorCustomer] = useState([])
    const [documentsAttach, setDocumentsAttach] = useState([])
    const [selectedFileType1, setSelectedFileType1] = useState('');
    const [selectedFilePath1, setSelectedFilePath1] = useState('');
    const [showImgModal1, setshowImgModal1] = useState(false);
    let checkboxData = localStorage.getItem('checkboxStatus')
    const {
        vendorFormData,
        setVendorFormData,
        setgetVendorFormData,
        getVendorFormData,
        getVendorData,
        getGSTDetails,
        getMajorCustomers,
        getCoreGoodServies,
        documentAttachment,
        formFilled,
        serviceProvidedList,
        showLoader,
        setShowLoader,
        filledstatus,
        uploadedSignForm
    } = CommonVendor();


    const handleCloseAddSuccModal1 = () => {
        setshowImgModal1(false)
    }

    useEffect(() => {
        getVendorData()
    }, [])

    const modules = {
        toolbar: [
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ],
    }

    const normalAttachments = documentAttachment?.filter(attachment => attachment.vendorDocumentMaster.documentId !== 6 && attachment.vendorDocumentMaster.documentId !== 10);

    const documentId10Attachments = uploadedSignForm.filter(attachment => attachment.vendorDocumentMaster.documentId === 10);
    console.log("uploaded dta", documentId10Attachments)

    const handleFileClick = (fileType, filePath) => {
        setSelectedFilePath1(filePath);
        setSelectedFileType1(fileType)
        setshowImgModal1(true);
    };
    const [currencySign, setCurrencySign] = useState('');
    useEffect(() => {
        let sign = getVendorFormData?.accCurrency?.split(' ');

        if (sign && sign.length > 1) {
            setCurrencySign(sign[1]);
        } else {
            setCurrencySign(''); // or set to a default value
        }
    }, [getVendorFormData?.accCurrency]);
    return (
        <>
            <div>
                {
                    (formFilled === true && filledstatus === false) && (
                        <div className='vendorFormMainDiv'>
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
                                            <p className='commonparaStyle'>{getVendorFormData?.legalName}</p>

                                        </div>
                                        <div className='kycFormDiv'>
                                            <label>Trade Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                            <p className='commonparaStyle'>{getVendorFormData?.tradeName}</p>

                                        </div>
                                        <div className='kycFormDiv kycFormmargin'>
                                            <label>Company Type</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.companyType}</p>

                                        </div>
                                        <div className='kycFormDiv kycFormmargin'>
                                            <label>Telephone No</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.telephoneNo}</p>


                                        </div>
                                    </div>
                                    <div className='addressMainDiv'>
                                        <h2 className='addressHeader' >Billing Address<span className='kycStar' style={{ color: "red" }}>*</span></h2>
                                        <div className='addressInnerDiv'>
                                            <div className='addressDivInput1'>

                                                <label>Address Line 1</label>
                                                <p className='commonparaStyle'>{getVendorFormData?.billingAddress1}</p>


                                            </div>

                                            {
                                                (getVendorFormData.billingAddress2 != null) && (
                                                    <div className='addressDivInput1'>

                                                        <label>Address Line 2</label>
                                                        <p className='commonparaStyle'>{getVendorFormData?.billingAddress2}</p>
                                                    </div>
                                                )
                                            }
                                            <div className='addressDivInput'>

                                                <><label>City</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.billingCity}</p>
                                                </>


                                            </div>
                                            <div className='addressDivInput'>

                                                <><label>State</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.billingState}</p>
                                                </>


                                            </div>
                                            <div className='addressDivInput'>

                                                <>
                                                    <label>Country</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.billingCountry}</p>
                                                </>



                                            </div>
                                            <div className='addressDivInput'>

                                                <>
                                                    <label>Zip Code</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.billingZipCode}</p>
                                                </>


                                            </div>

                                        </div>
                                    </div>

                                    <>
                                        <div className='checkbox-container1'>
                                            <span>Shipping Address<span style={{ color: "red" }}>*</span></span>

                                        </div>

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


                                    <>
                                        <div className="checkbox-container">
                                            <span>Do you come under MSME?<span style={{ color: "red" }}>*</span></span>
                                            <div className="options">
                                                <p className='commonparaStyle'>{getVendorFormData.isUnderMsme}</p>
                                            </div>

                                        </div>
                                    </>



                                    <div className="checkbox-container">
                                        <span>Are you registered under GST?<span style={{ color: "red" }}>*</span></span>
                                        <div className="options">
                                            <p className='commonparaStyle'>{getVendorFormData.isUnderGst}</p>
                                        </div>
                                    </div>


                                    <div className="checkbox-container">
                                        <span>Do you come under Tax Exemptions?<span style={{ color: "red" }}>*</span></span>
                                        <div className="options">
                                            <p className='commonparaStyle'>{getVendorFormData.isUnderTaxExemptions}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (getVendorFormData.isUnderGst === 'YES') ?
                                    <>
                                        <div className='vkycSubDiv'>
                                            <div className='supplierFirstDiv' style={{ marginTop: '20px' }}>
                                                <div className='supplierHeaderBorderLine'>
                                                    <h1 className='supplierHeader'>Tax Details</h1>
                                                </div>
                                            </div>
                                            <div className='taxSecondDiv'>
                                                <span style={{ color: 'grey', fontSize: '15px' }}>Tax Details<span style={{ color: 'red', marginBottom: '-5px' }}>*</span></span>
                                                {getGSTDetails?.map((entry, index) => (
                                                    <div className='taxMainOuterDiv'>
                                                        <div className='taxaddressInnerDiv' key={index}>
                                                            <div className='taxaddressDivInput'>
                                                                <label>Code</label>
                                                                <p className='commonparaStyle'>{entry.vendorStateGSTCode.stateGstCode}</p>
                                                            </div>
                                                            <div className='taxaddressDivInput'>
                                                                <label>State</label>
                                                                <p className='commonparaStyle'>{entry.vendorStateGSTCode.state}</p>
                                                            </div>
                                                            <div className='taxaddressDivInput'>
                                                                <label>GST No</label>
                                                                <p className='commonparaStyle'>{entry.gstNo}</p>
                                                            </div>
                                                            <div className='taxaddressDivInput'>
                                                                <label>Pan No</label>
                                                                <p className='commonparaStyle'>{entry.panNo}</p>
                                                            </div>

                                                        </div>
                                                        <div className='taxAddressDivInput1'>
                                                            <label>Address</label>
                                                            <p className='commonparaStyle'>{entry.gstAddress}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='detailsOfService'>
                                            <div className='supplierFirstDiv' style={{ marginTop: '0px' }}>
                                                <div className='supplierHeaderBorderLine'>
                                                    <h1 className='supplierHeader'>Details Of Service Provided</h1>
                                                </div>
                                            </div>
                                            <div className='serviceSecondDiv' >
                                                <span style={{ color: 'grey', fontSize: '15px' }}>Details Of Service Provided<span style={{ color: 'red', marginBottom: '-5px' }}>*</span></span>
                                                {serviceProvidedList?.map((entry, index) => (
                                                    <div className='addressInnerDiv' key={index}>
                                                        <div className='addressDivInput'>
                                                            <label>Service Accounting Code</label>
                                                            <p className='commonparaStyle'>{entry.serviceAccgCode}</p>
                                                        </div>
                                                        <div className='addressDivInput'>
                                                            <label>GST Rate Expected</label>
                                                            <p className='commonparaStyle'>{entry.gstRateExpected}</p>
                                                        </div>
                                                        <div className='addressDivInput2'>
                                                            <label>Description Of Service</label>
                                                            <p className='commonparaStyle'>{entry.descOfServices}</p>
                                                        </div>
                                                        <div className="checkbox-containerNew">
                                                            <span>Whether opted for composition scheme under GST?</span>
                                                            <div className="options">
                                                                <p className='commonparaStyle'>{entry.isCompSchemeUnderGst}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                            }
                            <hr className='vkycfHr' />
                            <div className='vkycSubDiv'>
                                <div className='supplierFirstDiv'>
                                    <div className='supplierHeaderBorderLine'>
                                        <h1 className='supplierHeader'>SPOC Details</h1>
                                    </div>
                                </div>
                                <div className='contactSecondDiv'>
                                    <table className="contactTable">
                                        <thead>
                                            <tr>
                                                <th>Department</th>
                                                <th>Contact Name<span style={{ color: "red" }}>*</span></th>
                                                <th>Email ID<span style={{ color: "red" }}>*</span></th>
                                                <th>Mobile No<span style={{ color: "red" }}>*</span></th>
                                                <th>Telephone No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: "#cecbcb" }}><span style={{ marginLeft: "11px" }}>Accounts</span></td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accContactName}</p>

                                                </td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accEmail}</p>

                                                </td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accMno}</p>

                                                </td>


                                                <td>
                                                    {(getVendorFormData.accTelNo != null && getVendorFormData.accTelNo !== '') ? (
                                                        <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.accTelNo}</p>
                                                    ) : (
                                                        <p>N/A</p>
                                                    )}
                                                </td>

                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: "#cecbcb" }}><span style={{ marginLeft: "11px" }}>Sales</span></td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.salesContactName}</p>

                                                </td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.salesEmail}</p>

                                                </td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.salesMno}</p>

                                                </td>

                                                <td>
                                                    {getVendorFormData?.salesTelNo ? (
                                                        <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData.salesTelNo}</p>
                                                    ) : (
                                                        <p>N/A</p>
                                                    )}
                                                </td>

                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: "#cecbcb" }}><span style={{ marginLeft: "11px" }}>Escalation</span></td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.escalationContactName}</p>

                                                </td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.escalationEmail}</p>

                                                </td>
                                                <td>

                                                    <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData?.escalationMno}</p>

                                                </td>


                                                <td>
                                                    {getVendorFormData?.escalationTelNo ? (
                                                        <p className='commonparaStyle' style={{ border: "none" }}>{getVendorFormData.escalationTelNo}</p>
                                                    ) : (
                                                        <p>N/A</p>
                                                    )}
                                                </td>

                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr className='vkycfHr' style={{ margin: '15px 30px 20px 30px' }} />
                            <div className='vkycSubDiv'>
                                <div className='supplierFirstDiv'>
                                    <div className='supplierHeaderBorderLine'>
                                        <h1 className='supplierHeader'>Financial Details</h1>
                                    </div>
                                </div>
                                <div className='financialSecondDiv'>
                                    <div className='benifiAccNoDiv'>
                                        <div className='kycFormDiv'>
                                            <label>IFSC Code</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                            <p className='commonparaStyle'>{getVendorFormData?.ifscCode}</p>
                                        </div>
                                        <div className='kycFormDiv'>
                                            <label>Bank Name</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                            <p className='commonparaStyle'>{getVendorFormData?.bankName}</p>
                                        </div>
                                        <div className='kycFormDiv'>

                                            <label>Branch</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.branch}</p>
                                        </div>
                                    </div>
                                    <div className='benifiAccNoDiv'>
                                        <div className='benifiAccNokycFormDiv kycFormmargin1'>
                                            <label>Beneficiary Account Name</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.benificaryAccName}</p>

                                        </div>
                                        <div className='benifiAccNokycFormDiv kycFormmargin1'>
                                            <label>Account No</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.accNo}</p>

                                        </div>
                                    </div>
                                    <div className='kycFormDiv2 kycFormmargin1' style={{ marginBottom: '-10px' }}>
                                        <label>Bank Address</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                    </div>
                                    <div className='addressMainDiv'>
                                        <div className='addressInnerDiv'>
                                            <div className='addressDivInput1'>

                                                <>
                                                    <label>Address Line 1</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.bankAddress1}</p>
                                                </>

                                            </div>

                                            {
                                                (getVendorFormData.bankAddress2 != null) && (
                                                    <div className='addressDivInput1'>
                                                        <label>Address Line 2</label>
                                                        <p className='commonparaStyle'>{getVendorFormData?.bankAddress2}</p>
                                                    </div>
                                                )
                                            }
                                            <div className='addressDivInput'>

                                                <>
                                                    <label>City</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.bankCity}</p>
                                                </>


                                            </div>
                                            <div className='addressDivInput'>

                                                <>
                                                    <label>State</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.bankState}</p>
                                                </>

                                            </div>
                                            <div className='addressDivInput'>

                                                <>
                                                    <label>Country</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.bankCountry}</p>
                                                </>
                                            </div>
                                            <div className='addressDivInput'>

                                                <>
                                                    <label>Zip code</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.bankZipCode}</p>
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='benifiAccNoDiv kycFormmargin1'>
                                        <div className='benifiAccNokycFormDiv'>
                                            <label>Account Currency</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.accCurrency}</p>
                                        </div>
                                        {
                                            (getVendorFormData?.swift != null) && (
                                                <div className='benifiAccNokycFormDiv'>
                                                    <label>SWIFT (mandatory in foreign payment)</label>
                                                    <p className='commonparaStyle'>{getVendorFormData?.swift}</p>
                                                </div>
                                            )
                                        }
                                    </div>

                                    {
                                        (getVendorFormData?.intermediary != null) && (
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

                                        <div className="options">
                                            <p className='commonparaStyle'>{currencySign}  {getVendorFormData?.companyTurnOver}</p>
                                        </div>



                                    </div>


                                    <div className="checkbox-container kycFormmargin1">
                                        <span>ITR Filled?<span style={{ color: "red" }}>*</span></span>
                                        <div className="options">
                                            <p className='commonparaStyle'>{getVendorFormData?.isItrFiled}</p>
                                        </div>

                                    </div>

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
                                    <ReactQuill
                                        value={getCoreGoodServies[0]?.coreGoodsService}
                                        // onChange={handleGoodService}
                                        // placeholder='Enter Answer'
                                        modules={modules}
                                        readOnly={true}
                                        className="custom-quill"
                                    />

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
                                        <ReactQuill
                                            value={getMajorCustomers[0]?.majorCustomer}
                                            // onChange={handleCustomer}
                                            // placeholder='Enter Answer'
                                            modules={modules}
                                            readOnly={true}
                                            className="custom-quill"
                                        />

                                    </div>
                                </div>
                            </div>

                            {
                                (normalAttachments?.length > 0) && (
                                    <div className='vkycSubDiv' style={{ marginTop: '14px' }}>
                                        <div className='supplierFirstDiv'>
                                            <div className='supplierHeaderBorderLine'>
                                                <h1 className='supplierHeader'>Uploaded Documents</h1>
                                            </div>
                                        </div>
                                        <div className='docDetailsSecondDiv'>
                                            {normalAttachments?.map((attachment, index) => (
                                                <div className='docDetailsInner1' style={{ padding: '5px 0', border: '1px solid #C22457' }}>
                                                    <label className='docLabels'>
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
                            <hr className='vkycfHr' />
                            <div className='vkycSubDiv'>
                                <div className='supplierFirstDiv2'>
                                    <div className='supplierHeaderBorderLine'>
                                        <h1 className='supplierHeader'>Declaration (Authorised Supplier’s Representative and Approved Signatory) </h1>
                                    </div>
                                </div>
                                <div className='declSecondDiv'>
                                    <div className='kycHeadingDiv'>
                                        <p>
                                            <input type='checkbox' checked={checkboxData || formFilled} style={{ marginRight: '10px' }} disabled={formFilled} />
                                            I hereby declare that, to the best of my knowledge, the information furnished in this form is true and correct in every respect.<span style={{ color: "red" }}>*</span>
                                        </p>
                                    </div>
                                    <div className='decInnerDiv'>
                                        <div className='vkycfDeclarationDiv'>
                                            <label>Name</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.name}</p>

                                        </div>
                                        <div className='vkycfDeclarationDiv'>
                                            <label>Designation</label><span className='kycStar' style={{ color: "red" }}>*</span>

                                            <p className='commonparaStyle'>{getVendorFormData?.designation}</p>

                                        </div>
                                        <div className='vkycfDeclarationDiv'>
                                            <label>Date</label><span className='kycStar' style={{ color: "red" }}>*</span>
                                            <DatePicker
                                                className='datepicker'
                                                // selected={vendorFormData?.date}
                                                value={getVendorFormData?.date}
                                                dateFormat='dd-MM-yyyy'
                                                placeholderText='dd-MM-yyyy'
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='vkycfHr' />
                            <ReactModal isOpen={showImgModal1} contentLabel="Minimal Modal Example"
                                className="vendorFillModal vendorFillModal modalRes" overlayClassName="vendorFillOverlay"
                                ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseAddSuccModal1} >
                                <div className="delete_close">
                                    <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseAddSuccModal1} style={{ width: "30px" }} />
                                </div>
                                <div className="HeroDiv MsgDiv">
                                    {selectedFileType1 === 'application/pdf' ? (
                                        <div style={{ width: '100%', cursor: 'pointer' }}>
                                            <iframe
                                                src={selectedFilePath1}
                                                style={{ width: '800px', height: '400px' }}
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={selectedFilePath1}
                                            alt="Selected File"
                                            style={{ width: '100%', height: '400px', border: '1px solid black' }}
                                        />
                                    )}
                                </div>
                            </ReactModal>
                        </div>
                    )
                }

                {
                    filledstatus === true && (
                        <div style={{ width: '83%', cursor: 'pointer' }} className='vendorFillFormMainDiv'>

                            <iframe
                                src={`data:application/pdf;base64,${documentId10Attachments[0]?.documentAttachment}`}
                                style={{ width: '100%', height: '400px' }}
                            />

                        </div>
                    )
                }

            </div>
            <div className='vendormainButtonDiv2'>
                <button className='nextButton' onClick={() => {
                    navigate(`/app/kycLink`)
                }}>Back</button>
            </div>
        </>


    )
}

export default VendorFillForm