import React, { useContext, useEffect, useState } from 'react';
import './Sidebar.css';
import { NavLink, useLocation } from 'react-router-dom';
import vendorOnboardingIcon from '../CustomerFeedback/Assets/partner-handshake-icon 1.svg';
import customerFeedbackIcon from '../CustomerFeedback/Assets/Group 10.svg';
import vendor2 from '../CustomerFeedback/Assets/vendor2.svg'
import lefside from '../CustomerFeedback/Assets/left-side.svg'
import rightside from '../CustomerFeedback/Assets/right-side.svg'
import { MdOutlineKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { contextData } from '../Context/MyContext';
import SidebarCommon from '../CommonComponents/SidebarCommon';
import seprate from '../CustomerFeedback/Assets/seprat.svg'
import { decryptResponseToken } from '../Constants/EncryptDecryptFunc';
import CommonRackside from '../CommonComponents/CommonRackside';

function Sidebar() {
    const [show, setShow] = useState(false);
    const location = useLocation();
    const [isActiveNumber, SetisActiveNumber] = useState(2);
    const { sidebarExpanded, setSetsidebarExpanded } = useContext(contextData);
    const [feedbackiconToggle, setFeedbackicontoggle] = useState(false);
    const [showmenu, setshowmenu] = useState(false);

    const handleIconToggle = () => {
        setFeedbackicontoggle(!feedbackiconToggle);
    };

    const handleshow = () => {
        setshowmenu(!showmenu);
    };

    const updateActiveNumber = () => {
        if (location.pathname.includes("CSFilledFeedbackForm") || location.pathname.includes("CSDownloadView") || location.pathname.includes("/app/CSLink")) {
            SetisActiveNumber(3);
        }
    };

    useEffect(updateActiveNumber, [location.pathname]);

    useEffect(() => {
        if (sessionStorage.getItem("SidebarId") != null) {
            SetisActiveNumber(sessionStorage.getItem("SidebarId"));
        } else {
            SetisActiveNumber(2);
        }
    }, [isActiveNumber]);

    const toggleElement = (no) => {
        sessionStorage.setItem("SidebarId", no);
    };

    useEffect(() => {
        setFeedbackicontoggle(false);
    }, [show]);

    const toogleBtnClick = () => {
        if (show) {
            setSetsidebarExpanded(true)
            sessionStorage.setItem("SidebarToggle", true);
        } else {
            setSetsidebarExpanded(false);
            sessionStorage.setItem("SidebarToggle", false);
        }
    }

    const rbacks = CommonRackside();
// console.log("Rbackssssssssssss",rbacks)     

    return (
        <div className='sidebarwrapper' key={sidebarExpanded}>
            <div className={show ? "sidebar-container-large" : "sidebar-container-small"}>
                <div className='sidebar-wrapper'>
                    <div className="sidebar-btn">
                        <button id="toggleBtn" onClick={() => { setShow(!show); toogleBtnClick() }} title='Expand'>
                            {
                                sidebarExpanded ? < img src={lefside} /> : < img src={rightside} />
                            }

                        </button>
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-nav" >
                        <div className="navlist">
                            <ul className={show ? 'navlist-sub ' : "small-navlist-sub"}  >
                                {

                                    <>
                                        <div className={show ? "customerFeedbackFirstDiv" : "admin-btn"} onClick={handleshow}>
                                            <span className='navicon' title='Feedback'>
                                                <img src={customerFeedbackIcon} alt='home-icon' title="Feedback" ></img>
                                            </span>
                                            <span className='navtitle' onClick={handleIconToggle}>Feedback</span>
                                            {show && (
                                                <span onClick={handleIconToggle}>
                                                    {feedbackiconToggle ? <MdOutlineKeyboardArrowUp fill='#3949AB' style={{ position: "relative", top: "3px", fontSize: "25px" }} />
                                                        : <MdKeyboardArrowDown fill='#3949AB' style={{ position: "relative", top: "3px", fontSize: "25px" }} />
                                                    }
                                                </span>
                                            )}
                                        </div>

                                    </>


                                }



                                {!showmenu && (
                                    <SidebarCommon show={show} isActiveNumber={isActiveNumber} setSetsidebarExpanded={setSetsidebarExpanded} toggleElement={toggleElement} SetisActiveNumber={SetisActiveNumber}  />
                                )}






                                {/* {feedbackiconToggle && (
                                    <div className='largeshow' style={{ margin: "0 auto", height: show ? "220px" : "auto" }}>
                                        <div className="tab-title">
                                            <span className='navtitle' >Feedback</span>
                                            {show && <span onClick={handleIconToggle}>
                                                {feedbackiconToggle ?
                                                    <MdOutlineKeyboardArrowUp fill='#3949AB'
                                                        style={{ position: "relative", top: "3px", fontSize: "25px" }} />
                                                    :
                                                    <MdKeyboardArrowDown fill='#3949AB' style={{ position: "relative", top: "3px", fontSize: "25px" }} />
                                                }
                                            </span>}
                                        </div>
                                        <SidebarCommon show={show} isActiveNumber={isActiveNumber} setSetsidebarExpanded={setSetsidebarExpanded} toggleElement={toggleElement} SetisActiveNumber={SetisActiveNumber} />
                                    </div>
                                )} */}
                                {show ?
                                    <>


                                        <img src={seprate} alt='' className='sprate' style={{ marginTop: feedbackiconToggle ? "0px" : "2px" }} />

                                        <>
                                            {
                                                rbacks?.vendorOnboarding &&
                                                <NavLink to='/app/kycLink' onClick={() => {
                                                    SetisActiveNumber(5);
                                                    toggleElement(5);
                                                    isActiveNumber != 5 && setSetsidebarExpanded(true);
                                                }}
                                                    style={{
                                                        textDecoration: "none"
                                                    }}
                                                    className="vendorAnchor">
                                                    <li className={isActiveNumber == 5 ? 'activeClass' : 'adminnav'}
                                                        style={{ backgroundColor: isActiveNumber == 5 ? "#00ADEE" : "#ffffff" }}
                                                    >
                                                        <span className={isActiveNumber == 5 ? 'admin-sub-list-iconActive ' : 'admin-sub-list-icon'} title='Vendor Onboarding'
                                                            style={{ paddingLeft: show ? "5px" : "2px", marginLeft: "-2px" }}
                                                        >
                                                            {isActiveNumber == 5 ?
                                                                <img className="navlistSubImage" src={vendor2} />
                                                                :
                                                                <img className="navlistSubImage" src={vendorOnboardingIcon} />}

                                                        </span>
                                                        <span className={isActiveNumber == 5 ? 'activeTitle' : 'adminnavtitle'} style={{ position: "relative", left: !feedbackiconToggle ? "-10px" : "-2px" }}>Vendor Onboarding</span>

                                                    </li>
                                                </NavLink>
                                            }
                                        </>
                                    </>
                                    :
                                    <>
                                        <>
                                            {
                                                rbacks?.vendorOnboarding &&

                                                <NavLink to='/app/kycLink' onClick={() => {
                                                    SetisActiveNumber(5);
                                                    toggleElement(5);
                                                    setSetsidebarExpanded(true);
                                                }}
                                                    style={{
                                                        textDecoration: "none",
                                                        marginTop:'6px'
                                                    }}
                                                    className="vendorAnchor">
                                                    <li className={isActiveNumber == 5 ? 'activeClass' : 'adminnav'}
                                                        style={{ backgroundColor: isActiveNumber == 5 ? "#00ADEE" : "#ffffff" }}
                                                    >
                                                        <span className={isActiveNumber == 5 ? 'admin-sub-list-iconActive1 ' : 'admin-sub-list-icon'} title='Vendor Onboarding' style={{ paddingLeft: show ? "5px" : "2px" }}>
                                                            {isActiveNumber == 5 ?
                                                                <img className="navlistSubImage" src={vendor2} />
                                                                :
                                                                <img className="navlistSubImage" src={vendorOnboardingIcon} />}

                                                        </span>
                                                        <span className={isActiveNumber == 5 ? 'activeTitle' : 'adminnavtitle'}>Vendor Onboarding</span>

                                                    </li>
                                                </NavLink>

                                            }
                                        </>

                                    </>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
