import React from "react";
import "./HeaderFooterTemplate.css";
import headerImage from "../../CustomerFeedback/Assets/pdfHeaderbg.svg";
import footerImage from "../../CustomerFeedback/Assets/pdfFooterBg.png";
import { PiCopyrightThin } from "react-icons/pi";
import Commonfooterdetails from "../Commonfooterdetails";
import copyright from '../../CustomerFeedback/Assets/rightcopy.png'
import phone from '../../CustomerFeedback/Assets/phoneImg.svg'
import website from '../../CustomerFeedback/Assets/websiteImg.svg'
import email from '../../CustomerFeedback/Assets/emailImg.svg'


const HeaderFooterTemplate = (props) => {

  const totalPages = props?.totalPages


  return (
    <div className="pdftemplatewrapper">
      <div className="pdfhead" >
        <div className="headerwrapper">
          <img
            src={headerImage}
            alt="headerimg"
            style={{
              width: "100%",
              height: "auto",
              position: "relative",
              zIndex: "99",
            }}
          />
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}></div>


      <div className="pdffooter">
        <div className="footerwrapper">
          <img
            src={footerImage}
            alt="footerimg"
            style={{
              width: "100%",
              height: "auto",
              position: "relative",
              bottom: "-7px",
              zIndex: "99",
            }}
          />
          <div className="pagenumber" style={{ position: "relative", top: "-25px", left: "92%", zIndex: "200" }}>
            <span className="page">{props?.pageNum}</span>

          </div>
          <span className=" pagecopy" style={{ position: "relative", top: "-48px", left: "30%", zIndex: "200", fontSize: "10px", color: "white" }} >
            <img src={copyright} style={{position:"relative",top:"1px",width:"10px",height:"10px",left:"-2px"}}/>
            Copyright 2024 Rabbit and Tortoise Technology Solutions.
          </span>
        </div>
      </div>
      {
        props?.pageNum === totalPages &&
        <div className="companydetails" style={{ position: "absolute", bottom: '6vh', right: '30px' }}>
          <div className='detailsdata'>
            <div className='icondata'>
              <img src={phone} alt='call' />
              <h1 className='detailheader' style={{ fontSize: '12px', color: '#D21363' ,fontWeight:"500"}}>+91 2027012345 </h1>
            </div>
            <div className='icondata'>
              <img src={website} alt='website' />
              <h2 className='detailheader' style={{ fontSize: '12px', color: '#D21363' }}>
                <a href='https://rabbitandtortoise.com/' style={{ textDecoration: 'none', color: '#D21363' ,fontWeight:"500"}}>www.rnt.ai</a>
              </h2>
            </div>
            <div className='icondata'>
              <img src={email} alt='email' />
              <h3 className='detailheader' style={{ fontSize: '12px', color: '#D21363' ,fontWeight:"500"}}>info@rnt.ai</h3>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default HeaderFooterTemplate;
