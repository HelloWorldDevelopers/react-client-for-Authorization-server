import React from 'react'

const VendorShippingAddress = ({getVendorFormData}) => {
    return (
        <div className='addressMainDiv'>
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
        </div>
    )
}

export default VendorShippingAddress