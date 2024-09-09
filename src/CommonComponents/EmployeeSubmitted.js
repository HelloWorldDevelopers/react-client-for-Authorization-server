import React from 'react';

const EmployeeSubmittedQuestionAnswerBlock = ({ item, feedbackDetails, questionId }) => {
    return (
        <div className="mainContentDiv" key={item.questionId}>
            <div className="questionDiv">
                <span className="reviewquesStyle">Question</span>
                <span className="reviewquesSemiStyle one">:</span>
                <span className="questionDetails1 pro">{item.question}</span>
            </div>
            <div className="answerDiv">
                {feedbackDetails.map((feedItem) => {
                    return feedItem.questionMaster.questionId ===
                        item.questionId ? (
                            <>
                                <span className="reviewStyle">Response</span>
                                <span className="reviewSemiStyle two">:</span>
                                <p
                                    style={{ whiteSpace: "pre-line", position: "relative", left: "-8px", width: "80%" }}
                                    key={feedItem.questionMaster.questionId}
                                >
                                    {feedItem.answer}
                                </p>
                            </>
                        ) : null;
                })}
            </div>
        </div>
    );
};

export default EmployeeSubmittedQuestionAnswerBlock;
