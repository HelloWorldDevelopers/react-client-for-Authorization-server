import React from 'react'
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import loginsucess from '../CustomerFeedback/Assets/sucess.png'
function CommonSweetAlertnotifiy({title}) {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
        <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
      );
      Swal.fire({
       
              title: title,
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
}

export default CommonSweetAlertnotifiy