import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { contextData } from '../Context/MyContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import exlamentory from '../CustomerFeedback/Assets/exclamation-mark.png'
const Notifications = () => {
    const navigate = useNavigate();
    const { submitted, feedbackDetails } = useContext(contextData);
    const [questionList, setQuetionList] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [text, setText] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
    const [errorShow, setErrorShow] = useState(false);

    const style1 = {
        width: "25%",
        margin: "0 auto",
    };

    const style = {
        width: "50%",
        height: "78px",
        margin: "0 auto",
    };
    const notifyAlertCharacter = () => {
        toast.dismiss();
        toast.error("Blank Space Are Not Allowed");
    };

    const notifyFillAgain = () => {
        toast.dismiss();
        toast.error("Feedback Already Filled!");
    };

    const notify = () => {
        const imageHtml = ReactDOMServer.renderToStaticMarkup(
            <img src={exlamentory} alt="Custom Icon" className="custom-swal-icon1" />
        );
        Swal.fire({

            title: 'Please Fill Required Details!',
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



    const handleOpenAddSuccModal = () => {
        setshowAddSuccessModal(true);
    };

    const handleCloseAddSuccModal = () => {
        setshowAddSuccessModal(false);
    };

    return {
        notifyAlertCharacter,
        notifyFillAgain,
        notify,
        handleOpenAddSuccModal,
        handleCloseAddSuccModal,
        style1,
        style,
        submitted,
        feedbackDetails,
        navigate,
        questionList,
        setQuetionList,
        selectedOptions,
        setSelectedOptions,
        text,
        setText,
        showLoader,
        setShowLoader,
        showAddSuccessModal,
        setshowAddSuccessModal,
        errorShow,
        setErrorShow
    };
};

export default Notifications;
