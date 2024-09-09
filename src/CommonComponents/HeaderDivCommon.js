import React, { useEffect, useRef, useState } from 'react';
import logOutBtnImg from '../../src/CustomerFeedback/Assets/logoutBtn.svg'; // Renamed to avoid confusion
import logo from "../../src/CustomerFeedback/rntlogo (2).svg";
import userIcon from "../../src/CustomerFeedback/Assets/UserIcon.png";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function HeaderDivCommon({ profileImg, loginName, logoutBtnOpen, logoutRef, handleLogout }) {
  const navigate = useNavigate();
  const [Togglelogout, setTogglelogout] = useState(false);
  const logoutButtonRef = useRef(null); // Ref for logout button

  // Toggle logout button visibility
  const Toggleout = () => {
    setTogglelogout(prev => !prev);
  };

  const loginHeaderame = atob(sessionStorage?.getItem('loginName'));

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutButtonRef.current && !logoutButtonRef.current.contains(event.target)) {
        setTogglelogout(false);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="headerDiv">
      <div className="mainHeaderSection">
        <div className="HeaderlogoDiv">
          <img src={logo} alt="rntLogo" />
        </div>
        <div className="HeadertextDiv">Customer Feedback Tool</div>
        <div className="HeaderNotification">
          <div className="HeaderuserDiv" ref={logoutButtonRef}>
            {
              Togglelogout &&
              <button className='logbtn' onClick={handleLogout}>Logout <TbLogout2 /></button>
            }
            <div className="logoutUserImg">
              {
                profileImg == null ?
                  <img className="userImg" src={userIcon} alt="User Icon" /> :
                  <img className="userImg1" src={`data:image/png;base64,${profileImg}`} alt="User Profile" />
              }
            </div>
            <div className="userName">
              <span>{loginHeaderame}</span>
            </div>
            <IoIosArrowDown onClick={Toggleout} style={{ color: "white", fontSize: "21px" }} />
            <div
              className={`logout ${Togglelogout ? "show" : ""}`}
              ref={logoutRef}
            >
              <div className="toggleLogoutDiv">
                <div className="userNameForMbScreen">
                  <span>{loginHeaderame}</span>
                </div>
                {/* <div className="toggleLogoutBtns">
                  <button className="logoutbtn">
                    Logout
                  </button>
                  <span>
                    <img src={logOutBtnImg} alt='Logout Button' style={{ width: '50%' }} />
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderDivCommon;
