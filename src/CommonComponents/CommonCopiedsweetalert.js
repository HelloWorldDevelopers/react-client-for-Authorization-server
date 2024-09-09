import React from 'react'
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import copied_icon from '../../src/CustomerFeedback/Assets/sucess.png'
function CommonCopiedsweetalert({ title }) {
        const imageHtml = ReactDOMServer.renderToStaticMarkup(
          <img src={copied_icon} alt="Custom Icon" className="custom-swal-icon" />
        );
        Swal.fire({
          html: imageHtml,
          title: "Link Copied",
          allowOutsideClick: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            confirmButton:"custom-swal-confirm-button1"
          },
          timer: 2000, 
          showConfirmButton: false, // Do not show the OK button
        
        });
    
    
    }
export default CommonCopiedsweetalert