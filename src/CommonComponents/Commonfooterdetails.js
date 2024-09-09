import React from 'react'
import endImage from '../CustomerFeedback/Assets/pdfFooterBg.png'
import phone from '../../src/CustomerFeedback/Assets/phoneImg.svg'
import website from '../CustomerFeedback/Assets/websiteImg.svg'
import email from '../CustomerFeedback/Assets/emailImg.svg'

const Commonfooterdetails = () => {
    
  return (
    <div className='pdfFooterImage1' >
    <img src={endImage} alt='Image' className='pdfImage1' />
    <div className='PdficonDiv'>
      <div className='pdfIcons'>
        <img src={phone} alt='Phone Image' />
        <h1 className='PdficonHeader'>+91 2027012345 </h1>
      </div>
      <div className='pdfIcons'>
        <img src={website} alt='Website Image' />
        <h2 className='PdficonHeader'>
          <a href='https://rabbitandtortoise.com/' style={{ textDecoration: 'none', color: '#D21363' }}>www.rnt.ai</a>
        </h2>
      </div>
      <div className='pdfIcons3'>
        <img src={email} alt='Email Image' />
        <h3 className='PdficonHeader'>info@rnt.ai</h3>
      </div>
    </div>
  </div>
  )
}

export default Commonfooterdetails
