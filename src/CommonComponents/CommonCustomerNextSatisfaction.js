import React from 'react';

const FeedbackQuestions = ({ showdownloadBtn, question, index, needPadding }) => {

    return (
        <>
            <div className={showdownloadBtn ? 'pdfCustomerFeedbackmainContentDiv1' : 'pdfCustomerFeedbackmainContentDiv preview'} key={question?.questionMaster?.questionId}>
                <div className='pdfcustomerFeedbackquestionDiv'>
                    <div className='pdfcustomerFeedbackquestionDivQuestion'>
                        <span className='pdfcustomerFeedbackQuestionNo'>Question</span>
                        <span className='pdfcustomerSemicolon'>:</span>
                    </div>
                    <div className={showdownloadBtn ? 'pdffontSize' : 'pdfcustomerFeedbackQuestionDetails'}>
                        {question?.questionMaster?.question}
                    </div>
                </div>
                <div className='pdfanswerDivfeedNext'>
                    <div className='pdfcustomerFeedbackquestionDivQuestion'>
                        <span className='pdfcustomerFeedbackQuestionNo' style={{ color: "black", fontWeight: "500" }}>Response</span>
                        <span className='pdfcustomerSemicolon'>:</span>
                    </div>
                    <div style={{ color: "black", fontWeight: "500", whiteSpace: 'pre-line', fontSize: "10px",width:'85%',marginTop:"1px" }}>
                        {question?.answer}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackQuestions;
