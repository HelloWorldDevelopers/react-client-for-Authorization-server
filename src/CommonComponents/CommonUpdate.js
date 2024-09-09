import React from 'react'
import loginsucess from '../CustomerFeedback/Assets/sucess.png'
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
function CommonUpdate() {

    const notifyUpdateSuccess = () => {
        const imageHtml = ReactDOMServer.renderToStaticMarkup(
          <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
        );
        Swal.fire({
    
          title: 'Data Updated Successfully',
          html: imageHtml,
          allowOutsideClick: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            confirmButton: 'custom-ok-button',
          },
          timer: 2000, // Close after 2 minutes (120000 milliseconds)
          showConfirmButton: false,
    
        });
      };
      
  return {
    notifyUpdateSuccess
  }
}

export default CommonUpdate