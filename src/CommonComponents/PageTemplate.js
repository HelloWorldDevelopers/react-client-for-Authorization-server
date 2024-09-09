import React from 'react';

const PageTemplate = (props) => {
    const { pageNum, totalPages, endImage } = props;
    const isLastPage = pageNum === totalPages;

    return (
        <div style={{ position: "absolute", top: "10px", left: "10px", width: '100%', height: '16px' }}>
            {isLastPage && (
                <div className='pdfFooterImage1' style={{ position: "absolute", bottom: "0", top: '677px', left: "0", width: '100%', height: '10vh' }}>
                   <div>

                   </div>
                   <span className=" pagecopy" style={{ position: "relative", top: "-48px", left: "30%", zIndex: "200", fontSize: "10px", color: "white" }} >
            <img src={copyright} style={{position:"relative",top:"1px",width:"10px",height:"10px",left:"-2px"}}/>
            Copyright 2024 Rabbit and Tortoise Technology Solutions.
          </span>
                    <img src={endImage} alt='Footer Image' className='pdfImage1' style={{ width: "100%" }} />
                    
                </div>
            )}
        </div>
    );
};

export default PageTemplate;