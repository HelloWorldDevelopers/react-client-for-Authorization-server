import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import shutdown from '../../src/CustomerFeedback/Assets/shutdown.png'
const CommonSweetaler = ({ title }) => {
  const imageHtml = ReactDOMServer.renderToStaticMarkup(
    <img src={shutdown} alt="Custom Icon" className="custom-swal-icon" />
  );

  Swal.fire({
    html: imageHtml,
    title: title || 'Logout Successfully', // Default title if not provided
    allowOutsideClick: false,
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
    },
    timer: 2000, // Close after 2 minutes (120000 milliseconds)
    showConfirmButton: false,
  });
};

export default CommonSweetaler;
