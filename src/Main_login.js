


import { useState, useEffect } from 'react';
import headerImg from './CustomerFeedback/Assets/headerimg.svg';
import { IoEye } from 'react-icons/io5';
import { IoMdEyeOff } from 'react-icons/io';
import Intersection from './CustomerFeedback/Assets/Intersection.svg';
import cornerImg from './CustomerFeedback/Assets/cornerImage.svg';
import crypto from 'crypto-js';
import loginsucess from '../src/CustomerFeedback/Assets/sucess.png';
import { Url } from './Constants/APIUrlConstant';
import ReactDOMServer from 'react-dom/server';
import exlamentory from '../src/CustomerFeedback/Assets/exclamation-mark.png';
import cross from '../src/CustomerFeedback/Assets/delete-button.png';
import Swal from 'sweetalert2';
import './Main_login.css';
import { useNavigate } from 'react-router-dom';
import { decryptData, decryptResponseToken, encrypt } from './Constants/EncryptDecryptFunc';
import LoaderComponent from '../src/CommonComponents/httpmethods/LoaderComponent'
function Main_login() {
 
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
    const [token, setToken] = useState('');

  

  // const notifyLoginSuccess = () => {
  //   const imageHtml = ReactDOMServer.renderToStaticMarkup(
  //     <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
  //   );
  //   Swal.fire({
  //     title: 'Login Successfully',
  //     html: imageHtml,
  //     allowOutsideClick: false,
  //     customClass: {
  //       popup: 'custom-swal-popup',
  //       title: 'custom-swal-title',
  //       confirmButton: 'custom-ok-button',
  //     },
  //   });
  // };
  // useEffect(() => {
  //   let isLoggedOut = sessionStorage.getItem('isLoggedOut');
  //   if (isLoggedOut === "true") {
  //     const imageHtml = ReactDOMServer.renderToStaticMarkup(
  //       <img src={loginsucess} alt="Custom Icon" className="custom-swal-icon" />
  //     );
  //     Swal.fire({
  //       title: 'Logout Successfully',
  //       html: imageHtml,
  //       allowOutsideClick: false,
  //       customClass: {
  //         popup: 'custom-swal-popup',
  //         title: 'custom-swal-title',
  //         confirmButton: 'custom-ok-button',
  //       },
  //       timer: 2000, 
  //       showConfirmButton: false, 
  //     });
  //     sessionStorage.clear();
  //   } else {
  //     sessionStorage.clear();
  //     sessionStorage.removeItem('isLoggedOut');
  //   }
  // }, [loginsucess]);
  // const handleCloseLoginModal = () => {
  //   // navigate('/app');
  // };

  // const handleCheckboxChange = () => {
  //   setRememberMe(!rememberMe);
  // };

  // const handleTogglePassword = () => {
  //   setShowPassword(!showPassword);
  // };

  // const notifyAlertLoginError = () => {
  //   const imageHtml = ReactDOMServer.renderToStaticMarkup(
  //     <img src={exlamentory} alt="Custom Icon" className="custom-swal-icon1" />
  //   );
  //   Swal.fire({
  //     title: 'Please Enter Valid Credentials',
  //     html: imageHtml,
  //     allowOutsideClick: false,
  //     customClass: {
  //       popup: 'custom-swal-popup',
  //       title: 'custom-swal-title',
  //       confirmButton: 'custom-ok-button',
  //     },
  //     timer: 2000, 
  //     showConfirmButton: false,

  //   });
  // };

  // const notifyAlertLogin = (ErrorMessage) => {
  //   const imageHtml = ReactDOMServer.renderToStaticMarkup(
  //     <img src={cross} alt="Custom Icon" className="custom-swal-icon1" />
  //   );
  //   Swal.fire({
  //     title: ErrorMessage,
  //     html: imageHtml,
  //     allowOutsideClick: false,
  //     customClass: {
  //       popup: 'custom-swal-popup',
  //       title: 'custom-swal-title',
  //     },
  //     timer: 2000, // Close after 2 minutes (120000 milliseconds)
  //     showConfirmButton: false,
  //   });
  // };

  // const validateLogin = () => {
    // if (rememberMe) {
    //   try {
    //     const encryptedUsername = encrypt(userId, 'ThisIsASecretKey');
    //     const encryptedPassword = encrypt(password, 'ThisIsASecretKey');

    //     localStorage.setItem('encryptedUsername', encryptedUsername);
    //     localStorage.setItem('encryptedPassword', encryptedPassword);
    //     localStorage.setItem('rememberMe', rememberMe);
    //   } catch (error) {
    //     console.error('Encryption error:', error);
    //   }
    // } else {
    //   localStorage.removeItem('encryptedUsername');
    //   localStorage.removeItem('encryptedPassword');
    //   localStorage.removeItem('rememberMe');
    // }


useEffect(() => {
  const fetchToken = async () => {
    
    debugger;
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');

      if (code) {
        const response = await fetch(`http://localhost:9000/customer-feedback/api/v1/redirect?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.token) {
          setToken(data.token);
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('isAdmin', btoa('admin'));
          localStorage.setItem('isAdmin', btoa('admin'));

          // Fixed typo in the following line: requestOption should be requestOptions
         // sessionStorage.setItem('token', dara.token);

          fetch(Url.tokenParse, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + sessionStorage.getItem('token')  
              //'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
            },
            // body: JSON.stringify(requestOption),
          })
            .then((response) => response.json())
            .then((data) => {
              setShowLoader(false);
              const decryptedFullName = decryptResponseToken(data?.fullName);
              const decryptedStaffId = decryptResponseToken(data?.staffId);
              const decryptedRole = decryptResponseToken(data?.role);

              const allRbacks = data?.RBAC;
              if (allRbacks) {
                sessionStorage.setItem('allRbacks', allRbacks);
              } else {
                console.error('Rbacks are not available');
              }

              let fullnameBToA = btoa(decryptedFullName);
              sessionStorage.setItem('loginName', fullnameBToA);
              sessionStorage.setItem('staffId', decryptedStaffId);
              sessionStorage.setItem('role', decryptedRole);
              localStorage.setItem('role', decryptedRole);
              sessionStorage.setItem('feedback icon', true);

              if (decryptedRole === 'CustomerFeedBackUser') {
                navigate('/app/kycLink');
              } else {
                navigate('/app');
              }

              fetch(Url.getProfilePic?.replace('{id}', decryptedStaffId), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                  'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  setShowLoader(false);
                  if (data?.DATA?.profilePicture) {
                    sessionStorage.setItem('profilePic', data.DATA.profilePicture);
                  }
                })
                .catch((error) => {
                  console.error('Error fetching profile picture:', error);
                });

              fetch(Url.getCreatedLink, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + sessionStorage.getItem('token'),
                  'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  const finalData = [];
                  const filled = [];
                  const nonFilled = [];
                  data?.DATA?.forEach((item) => {
                    if (item?.filled) {
                      filled.push(item);
                    } else {
                      nonFilled.push(item);
                    }
                  });

                  nonFilled.forEach((row) => {
                    finalData.push(row);
                  });

                  filled.forEach((row) => {
                    finalData.push(row);
                  });
                })
                .catch((error) => {
                  console.error('Error fetching created links:', error);
                });

              //handleCloseLoginModal();
            })
            .catch((error) => {
             // setShowLoader(false);
              // notifyAlertLoginError();
              console.error('Error parsing token:', error);
            });
        }
      }
    } catch (error) {
      console.error('Error in fetchToken:', error);
    }
  };

  fetchToken();
}, []);


    // if (userId !== '' && password !== '') {
      // const headers = {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      //   'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
      // };
      // setShowLoader(true);
      // fetch(Url.authLogin, {
      //   method: 'POST',
      //   headers,
      //   body: JSON.stringify({
      //     // userId:userId,
      //     // password:password
      //     userId: encrypt(userId, 'ThisIsASecretKey'),
      //     password: encrypt(password, 'ThisIsASecretKey')
      //   }),
      // })
      //   .then((response) => {
      //     if (response.ok) {
      //       return response.json();
      //     }
      //     return Promise.reject(response);
      //   })
        // .then((json) => {
        //   setShowLoader(false);
        //   const requestOption = {
        //     token: json.TOKEN,
        //   };
        //   sessionStorage.setItem('isAdmin', btoa('admin'));
        //   localStorage.setItem('isAdmin', btoa('admin'));
        //   sessionStorage.setItem('token', requestOption?.token);

        //   fetch(Url.tokenParse, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       Authorization: "Bearer " + sessionStorage.getItem('token'),
        //       'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
        //     },
        //     body: JSON.stringify(requestOption),
        //   })
        //     .then((respone) => respone.json())
        //     .then((data) => {
        //       setShowLoader(false);
        //       const decryptedFullName = decryptResponseToken(data?.fullName);
        //       const decryptedStaffId = decryptResponseToken(data?.staffId);
        //       const decryptedRole = decryptResponseToken(data?.role);

        //       const allRbacks = data?.RBAC
        //       if (allRbacks) {
        //         sessionStorage.setItem('allRbacks', allRbacks);
        //       } else {
        //         console.error('Rbacks are not available');
        //       }

        //       let fullnameBToA = btoa(decryptedFullName);
        //       sessionStorage.setItem('loginName', fullnameBToA);
        //       sessionStorage.setItem('staffId', decryptedStaffId);
        //       sessionStorage.setItem('role', decryptedRole);
        //       localStorage.setItem('role', decryptedRole);
        //       sessionStorage.setItem('role', decryptedRole);
        //       sessionStorage.setItem('feedback icon', true);
        //       if (decryptedRole == 'CustomerFeedBackUser') {
        //         navigate('/app/kycLink');
        //       } else {
        //         navigate('/app');
        //       }
        //       fetch(Url.getProfilePic?.replace('{id}', decryptedStaffId), {
        //         method: 'GET',
        //         headers: {
        //           'Content-Type': 'application/json',
        //           Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        //           'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
        //         },
        //       })
        //         .then((respone) => respone.json())
        //         .then((data) => {
        //           setShowLoader(false);
        //           if (data?.DATA?.profilePicture) {
        //             sessionStorage.setItem('profilePic', data.DATA.profilePicture);
        //           }
        //         })
        //         .catch((error) => {
        //           console.error('Error fetching profile picture:', error);
        //         });

        //       fetch(Url.getCreatedLink, {
        //         method: 'GET',
        //         headers: {
        //           'Content-Type': 'application/json',
        //           Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        //           'X-CSRF-Token': 'YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2',
        //         },
        //       })
        //         .then((response) => response.json())
        //         .then((data) => {
        //           const finalData = [];
        //           const filled = [];
        //           const nonFilled = [];
        //           data?.DATA?.forEach((item) => {
        //             if (item?.filled) {
        //               filled.push(item);
        //             } else {
        //               nonFilled.push(item);
        //             }
        //           });
        //           nonFilled.forEach((row) => {
        //             finalData.push(row);
        //           });
        //           filled.forEach((row) => {
        //             finalData.push(row);
        //           });
        //         })
        //         .catch((error) => {
        //           console.error('Error fetching created links:', error);
        //         });

        //       handleCloseLoginModal();
        //     })
        //     .catch((error) => {
        //       setShowLoader(false);
        //       // notifyAlertLoginError();
        //       console.error('Error parsing token:', error);
        //     });
        // })
        // .catch((error) => {
        //   setShowLoader(false);
        //   notifyAlertLoginError(); // Triggering error notification
        //   console.error('Error logging in:', error);
        // });
    // } 
    // else {
    //   if (userId === '' && password === '') {
    //     notifyAlertLogin('Please enter username and password');
    //   } else if (userId === '') {
    //     notifyAlertLogin('Please enter username');
    //   } else if (password === '') {
    //     notifyAlertLogin('Please enter password');
    //   }
    // }
  //};

  // useEffect(() => {
  //   const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
  //   if (savedRememberMe) {
  //     const encryptedUsername = localStorage.getItem('encryptedUsername');
  //     const encryptedPassword = localStorage.getItem('encryptedPassword');

  //     if (encryptedUsername && encryptedPassword) {
  //       try {
  //         const decryptedUsername = decryptData(encryptedUsername, 'ThisIsASecretKey');
  //         const decryptedPassword = decryptData(encryptedPassword, 'ThisIsASecretKey');

  //         setUserId(decryptedUsername);
  //         setPassword(decryptedPassword);
  //         setRememberMe(true);
  //       } catch (error) {
  //         console.error('Decryption error:', error);
  //       }
  //     } else {
  //       setRememberMe(false);
  //       setUserId('');
  //       setPassword('');
  //     }
  //   }
  // }, []);

  return (
    // <div className="loginContainer">
    //   <div className="loginmain">
    //     <div
    //       isOpen={true}
    //       contentLabel="Minimal Modal Example"
    //       className="loginModal modalHeightLogin modalRes"
    //       overlayClassName="loginOverlay"
    //       ariaHideApp={false}
    //       shouldCloseOnOverlayClick={false}
    //       onRequestClose={handleCloseLoginModal}
    //     >
    //       <img src={headerImg} alt="Header Image" style={{ width: '100%' }} />
    //       <div className="loginModalMainDiv">
    //         <h1 className="loginHeaderH1">Customer Feedback Tool</h1>
    //         <div></div>
    //         <p className="loginParagraph">
    //           <span>Welcome To The Portal </span>{' '}
    //         </p>
    //         <div className="HeroDiv MsgDiv" style={{ marginTop: '-208px' }}>
    //           <div className="LoginInput_Container_Div">
    //             <div className="LoginInner_Div LoginInputMainDiv">
    //               <div className="LoginInputs LoginPageInput">
    //                 <div className="LoginInput_Label">
    //                   <label>
    //                     User Id<span style={{ color: 'red', marginLeft: '1px' }}>*</span>
    //                   </label>
    //                 </div>
    //                 <input
    //                   type="text"
    //                   value={userId}
    //                   onChange={(e) => {
    //                     setUserId(e.target.value);
    //                   }}
    //                   onKeyDown={(e) => {
    //                     if (e.key === 'Enter') {
    //                       validateLogin();
    //                     }
    //                   }}
    //                   placeholder="Enter User Id"
    //                 />
    //               </div>
    //               <div className="LoginInputs LoginPageInput">
    //                 <div className="LoginInput_Label">
    //                   <label>
    //                     Password<span style={{ color: 'red', marginLeft: '1px' }}>*</span>
    //                   </label>
    //                 </div>
    //                 <input
    //                   type={showPassword ? 'text' : 'password'}
    //                   value={password}
    //                   onChange={(e) => {
    //                     setPassword(e.target.value);
    //                   }}
    //                   onKeyDown={(e) => {
    //                     if (e.key === 'Enter') {
    //                       validateLogin();
    //                     }
    //                   }}
    //                   placeholder="Enter Password"
    //                 />
    //                 <span onClick={handleTogglePassword} className="eyeicon">
    //                   {showPassword ? <IoEye /> : <IoMdEyeOff />}
    //                 </span>
    //               </div>
    //               <div className="remember_me">
    //                 <input
    //                   className="login_checkbox"
    //                   type="checkbox"
    //                   id="rememberMe"
    //                   name="rememberMe"
    //                   onChange={handleCheckboxChange}
    //                   checked={rememberMe}
    //                 />
    //                 <label style={{ marginLeft: '5px', color: '#03232F', fontSize: '13px' }} htmlFor="rememberMe">
    //                   Remember Me
    //                 </label>
    //               </div>
    //               <div className="LoginButton_Container_Div LoginbuttonCreateLink">
    //                 <button onClick={() => validateLogin()}>Login</button>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="loginIntersectionDiv">
    //             <img src={Intersection} alt="Intersection image" className="loginIntersectionImage" />
    //           </div>
    //         </div>
    //       </div>
    //       <div className="loginCornerDiv">
    //         <img src={cornerImg} alt="Intersection image" className="loginCornerImage" />
    //       </div>
    //     </div>
    //   </div>

    //   <LoaderComponent showLoader={showLoader} />
    // </div>
<>loading.......</>

  );
}

export default Main_login;
