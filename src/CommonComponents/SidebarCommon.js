import React from 'react'
import { NavLink } from 'react-router-dom';
import customerSatisfactionIcon from '../CustomerFeedback/Assets/Vector.svg'
import employeeFeedbackIcon from '../CustomerFeedback/Assets/Customer Satisfaction Survey.svg';
import projectend from '../CustomerFeedback/Assets/projectef.svg'
import Employee from '../CustomerFeedback/Assets/employeee.svg'
import Project from '../CustomerFeedback/Assets/Project End Feedback white.svg'
import Customer from '../CustomerFeedback/Assets/Customer Satisfaction Survey white.svg'
import CommonRackside from '../CommonComponents/CommonRackside';


function SidebarCommon({ SetisActiveNumber, toggleElement, setSetsidebarExpanded, isActiveNumber, show }) {

    const rbacks = CommonRackside();

    return (
        <div className='admin-btn-sub-list-container-small'>

            <li style={{ boxShadow: "none" }}>
                <div className={show ? "admin-btn-sub-list-container" : ""} >
                    <ul className={show? "navlist-sub":"smallicon"} style={{ boxShadow: "none" }}>

                        {
                              rbacks?.projectEndFeedback &&
                              <NavLink to='/app/' onClick={() => {
                                SetisActiveNumber(2
                                );
                                toggleElement(2);
                                isActiveNumber != 2 && 
                                setSetsidebarExpanded(true);
                            }}
                                style={{
                                    textDecoration: "none"
                                }}>
                                <li className={isActiveNumber == 2 ? 'activeClass' : 'adminnav'}>
                                    <span className={isActiveNumber == 2 ? 'admin-sub-list-iconActive' : 'admin-sub-list-icon'} title='Project End Feedback'
                                 >
                                        {
                                            isActiveNumber == 2 ?
                                                <img className="navlistSubImage" src={Project} />
                                                :
                                                <img className="navlistSubImage" src={projectend} />
                                        }
    
                                    </span>
                                    <span className={isActiveNumber == 2 ? 'activeTitle' : 'adminnavtitle'}>Project End Feedback</span>
                                </li>
                            </NavLink>
    
                        }
                       

                       {
                          rbacks?.custSatisfactionSurvey &&
                          <NavLink to='/app/CSLink' onClick={() => {
                            SetisActiveNumber(3);
                            toggleElement(3);
                            isActiveNumber != 3 && setSetsidebarExpanded(true);
                        }}
                            style={{ textDecoration: "none" }}>
                            <li className={isActiveNumber == 3 ? 'activeClass' : 'adminnav'} >
                                <span className={isActiveNumber == 3 ? 'admin-sub-list-iconActive' : 'admin-sub-list-icon'} title='Customer Satisfaction Survey'
                                
                                >
                               
                                    {isActiveNumber == 3 ?
                                        <img className="navlistSubImage" src={Customer}/>
                                        : 
                                        <img className="navlistSubImage" src={employeeFeedbackIcon}/>
                                    }
                                </span>
                                <span className={isActiveNumber == 3 ? 'activeTitle' : 'adminnavtitle'}>Customer Satisfaction Survey</span>
                            </li>
                        </NavLink>
                       }
                       

                       {
                           rbacks.empFeedback &&
                        <NavLink to='/app/EmployeeLink' onClick={() => {
                            SetisActiveNumber(4);
                            toggleElement(4);
                            isActiveNumber != 4 && 
                            setSetsidebarExpanded(true);
                        }}
                            style={{
                                textDecoration: "none"
                            }}>
                            <li className={isActiveNumber == 4 ? 'activeClass' : 'adminnav'}>
                                <span className={isActiveNumber == 4 ? 'admin-sub-list-iconActive' : 'admin-sub-list-icon'} title='Employee Feedback' style={{}}>
                                    {
                                        isActiveNumber == 4 ?
                                            <img src={Employee} className="navlistSubImage" />
                                            :

                                            <img className="navlistSubImage" src={customerSatisfactionIcon}
                                                 />
                                    }

                                </span>
                                <span className={isActiveNumber == 4 ? 'activeTitle' : 'adminnavtitle'}  style={{ marginLeft:"-7px"}}  >Employee  Feedback </span>
                            </li>
                        </NavLink>
}
                    </ul>
                </div>
            </li>



        </div>
    )
}

export default SidebarCommon
