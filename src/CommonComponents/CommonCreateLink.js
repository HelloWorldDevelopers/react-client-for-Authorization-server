import { FaRegEdit } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import { TfiEmail } from 'react-icons/tfi';
import emailiconerror from '../../src/CustomerFeedback/Assets/delete-button.png'
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import sucess from '../../src/CustomerFeedback/Assets/sucess.png'
export const EmailSendAlertSuccess = () => {
  const imageHtml = ReactDOMServer.renderToStaticMarkup(
    <img src={sucess} alt="Custom Icon" className="custom-swal-icon" />
  );
  Swal.fire({
   
    title: 'Email Already Sent',
    html: imageHtml,
    allowOutsideClick: false,
    customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton:"custom-swal-confirm-button"

      },
      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,
    
  });
};

export const EmailSendSuccess = () => {
  const imageHtml = ReactDOMServer.renderToStaticMarkup(
    <img src={sucess} alt="Custom Icon" className="custom-swal-icon" />
  );
  Swal.fire({
    title: 'Email Sent Successfully',
    html: imageHtml,
    allowOutsideClick: false,
    customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton:"custom-swal-confirm-button"
      },
      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,
    });
};

export const EmailSendErrorSuccess = () => {
  const imageHtml = ReactDOMServer.renderToStaticMarkup(
    <img src={emailiconerror} alt="Custom Icon" className="custom-swal-icon" />
  );
  Swal.fire({
    title: 'Email ID is blocked, contact us .',
    html: imageHtml,
    allowOutsideClick: false,
    customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title1  ',
      },
      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,
     
    });
};

export const CreateLinkEditIcon = ({ handleCreateLinkEdit, data }) => (
  <FaRegEdit className="createLinkEdit" onClick={() => handleCreateLinkEdit(data)} />
);

export const CreateLinkViewIcon = ({ handleView, data }) => (
  <LuEye className="createLinkView" onClick={() => handleView(data)} />
);

export const CustomerSatisfactionEmailIcon = ({ url, id, handleSend, data }) => (
 
  <TfiEmail
    className="customerSatiscreateLinkView"
    onClick={() => handleSend(EmailSendAlertSuccess, EmailSendErrorSuccess, EmailSendSuccess, data, url, id)}
  />
  
);
