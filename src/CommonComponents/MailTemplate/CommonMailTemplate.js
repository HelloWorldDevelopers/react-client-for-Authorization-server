import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import cancel_btn from '../../CustomerFeedback/Assets/cancel.svg'
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import logo from '../../CustomerFeedback/Assets/logo.svg'
import './CommonMailTemplate.css'
import { toast } from 'react-toastify';
import mailHeaderIcon from '../../CustomerFeedback/Assets/MailTemplateHeaderIcon.svg'
import { CommonUrl, commonEmail } from '../../CommonComponents/CommonUrl'
const CommonMailTemplate = ({ showMailModel, handleCloseMailModal, subjectTitle, msg, send, color, mailTemplateData, id, custFeedbackId, customerFeedbackMaster, url }) => {
    const [isSubjectFocused, setIsSubjectFocused] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [emailData, setEmailData] = useState({
        from: `${commonEmail}`,
        to: null,
        subject: '',
        body: '',
    });

    useEffect(() => {
        if (mailTemplateData) {
            setEmailData({
                from: `${commonEmail}`,
                to: mailTemplateData?.email,
                subject: subjectTitle,
                body: msg,
            });
        }
    }, [mailTemplateData, subjectTitle, msg]);
    const handleInputChange = (field, value) => {
        setEmailData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const validateFields = () => {
        let isValid = true;
        let errorMessage = '';

        // Check if all fields are empty
        if (!emailData.subject && !emailData.body) {
            toast.error('All fields are mandatory.');
            return false;
        }

        if (!emailData.subject || !emailData.subject.length) {
            errorMessage += 'Subject field cannot be empty.\n';
            isValid = false;
        }

        if (!emailData.body || !emailData.body.length) {
            errorMessage += 'Message body cannot be empty.\n';
            isValid = false;
        }

        if (!isValid && errorMessage) {
            toast.error(`${errorMessage}`);
        }

        return isValid;
    };


    const [getMailStatus, setMailStatus] = useState(false)
    const getUpdatedMailBody = (mailBody) => {
        const signatureStart = mailBody.lastIndexOf("<p><br></p><p><br></p>") || mailBody.lastIndexOf("<br><br/>");
        if (signatureStart !== -1) {
            const restBody = mailBody.substring(0, signatureStart);
            const signatureBody = mailBody.substring(signatureStart);
            const totalUpdatedBody = restBody + signatureBody?.replaceAll('<p>', '<p style="padding: 0px; margin: 0px;">');
            console.log("getUpdatedMailBody signatureStart",signatureStart,
                "| restBody",restBody,
                "| signatureBody11",signatureBody,
                "| totalUpdatedBody",totalUpdatedBody
            )
            return totalUpdatedBody;
        } else {
            return mailBody;
        }
    }
    const handleSendEmail = async () => {
        if (!validateFields()) {
            return; // Stop if validation fails
        }

        if (isSending) {
            return; // Prevent multiple clicks
        }
    
        setIsSending(true);
        
        const payload = {
            [customerFeedbackMaster]: {
                [custFeedbackId]: id
            },
            fromEmail: emailData.from,
            toEmail: emailData.to,
            subject: emailData.subject,
            emailBody: await getUpdatedMailBody(emailData.body),
        };
        
        console.log("getUpdatedMailBody(emailData.body)",getUpdatedMailBody(emailData.body))
        console.log("priyanka api payload",payload)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem('token'),
                    "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                send()
                sessionStorage.setItem('mailDataSave', true)
                setMailStatus(true)
            } else {
                // toast.error('Failed to save email data');
                // Handle the error accordingly
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
        finally {
            setIsSending(false); // Re-enable the button after the operation is complete
        }
    };

    // console.log('email data', emailData)

    return (
        <ReactModal isOpen={showMailModel} contentLabel="Minimal Modal Example"
            className="Modal modalHeightCreatLink modalRes" overlayClassName="Overlay"
            ariaHideApp={false} shouldCloseOnOverlayClick={false} onRequestClose={handleCloseMailModal} >
            <div className="delete_close">
                <img src={cancel_btn} alt="cancel-btn" onClick={handleCloseMailModal} style={{ width: "30px" }} />
            </div>
            <div className="email-header">
                <img src={mailHeaderIcon} alt="Rabbit & Tortoise" className="company-logo" />
            </div>
            <div className="bottomLine"></div>
            <div className="send-email-container">
                <div className="from-field">
                    <div style={{ width: '9%' }}>
                        <label className='emailLabel1'>From </label>
                        <span style={{ marginLeft: '19px' }}>:</span>
                    </div>

                    <input
                        type="text"
                        value={emailData.from}
                        className='commonInput'
                        readOnly
                    />
                </div>

                <div className="to-field">
                    <div style={{ width: '9%' }}>
                        <label className='emailLabel1'>To </label>
                        <span style={{ marginLeft: '39px' }}>:</span>
                    </div>
                    <input
                        type="text"
                        value={emailData.to}
                        className='commonInput'
                        readOnly
                    />
                </div>
                <div className="subject-field">
                    <label className='emailLabel'>Subject&nbsp;&nbsp;:</label>
                    <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className='commonInput'
                        style={{ color: '#000' }}
                    />
                </div>
                <div className="message-body">
                    <ReactQuill
                        value={emailData.body}
                        onChange={value => handleInputChange('body', value)}
                        placeholder="Write your message here"
                       
                    />
                </div>
                <div className="send-button">
                    <button onClick={handleSendEmail}>Send Email</button>
                </div>
            </div>



        </ReactModal>
    )
}

export default CommonMailTemplate