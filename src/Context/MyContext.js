import { createContext, useState } from 'react';
import ReactModal from 'react-modal';
import cancel_btn from '../CustomerFeedback/Assets/cancel.svg'
import exclamatory from '../CustomerFeedback/Assets/exclamation-mark.png'
import { useNavigate } from 'react-router-dom';

export const contextData = createContext();

const MyContext = ({ children }) => {

    const [feedbackDetails, setFeedbackDetails] = useState([])
    const [activeItemIndex, setActiveItemIndex] = useState(null);
    const [sidebarExpanded, setSetsidebarExpanded] = useState(true);
    const [sideBarToggle, setsideBarToggle] = useState(false)
    const [isActiveNumber, SetisActiveNumber] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [vendorCreateLinkTable, setVendorCreateLinkTable] = useState([])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        // sessionStorage.setItem('isLoggedOut', "true");
        navigate('/')
    }

    return (
        <contextData.Provider
            value={{
                setFeedbackDetails,
                feedbackDetails,
                setActiveItemIndex,
                activeItemIndex,
                sidebarExpanded,
                setSetsidebarExpanded,
                sideBarToggle,
                setsideBarToggle,
                isActiveNumber,
                SetisActiveNumber,
                setSubmitted,
                submitted,
                vendorCreateLinkTable,
                setVendorCreateLinkTable,
                openModal
            }}>
            {children}
            <ReactModal
                isOpen={isModalOpen}
                contentLabel="Error Modal"
                className="logoutModal modalHeightCreatLink"
                overlayClassName="Overlay"
                ariaHideApp={false}
                shouldCloseOnOverlayClick={false}
                onRequestClose={closeModal}
            >
                {/* <div className="delete_close">
                    <img src={cancel_btn} alt="cancel-btn" onClick={closeModal} style={{ width: "30px" }} />
                </div>
                <div className="gradientDiv"></div> */}
                <div className='logoutModalMainDiv'>
                    {/* <div className="bug_modal_title">
                    <label style={{ fontWeight: '700', fontSize: '15px' }}>Logout</label>
                    </div> */}
                    <img src={exclamatory} alt="cancel-btn" style={{ width: "12%" }} />
                    <div className='logoutModalMessageDiv'>Session Expired!</div>
                    <div className="logoutModalButtonDiv">
                        <button onClick={closeModal}>OK</button>
                    </div>
                </div>
            </ReactModal>
        </contextData.Provider>
    )
}

export default MyContext;