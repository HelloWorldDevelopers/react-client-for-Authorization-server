import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import PropTypes from 'prop-types'
const LinkCellRenderer = ({ linkCopied, CommonUrl, params, copyText }) => {
    const newBase64String = btoa(params?.data?.custSatisfactionId);
    let link = `${CommonUrl}#/CustomerSatisfactionGetStarted/` + newBase64String
    return (
        <div className='ButtonDiv'>
            <a id="elementId" target="_blank" href={link}>{link}</a>
            <div>        <MdContentCopy className="icons" onClick={copyText} />
                {linkCopied ? <small className='copiedMessage'>Link Copied</small> : <></>}
            </div>
        </div>
    )
};

LinkCellRenderer.propTypes = {
    linkCopied: PropTypes.bool,
    CommonUrl: PropTypes.string,
    params: PropTypes.object,
    copyText: PropTypes.func,
}

export default LinkCellRenderer;
