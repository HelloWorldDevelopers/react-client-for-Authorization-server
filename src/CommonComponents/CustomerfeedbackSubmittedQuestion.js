import React from 'react';

const SubmittedQuestionAnswerBlock = ({ item, feedbackDetails, questionId }) => {
    return (
        <div className="mainContentDiv" key={item.questionId}>
            <div className="questionDiv">
                <span className="reviewquesStyle">Question</span>
                <span className="reviewquesSemiStyle one">:</span>
                <span className="questionDetails1 pro">{item.question}</span>
            </div>
            <div className="answerDiv">
                {feedbackDetails.map((feedItem) => {
                    return feedItem.questionMasterDto.questionId ===
                        item.questionId ? (
                            <>
                                <span className="reviewStyle">Response</span>
                                <span className="reviewSemiStyle two">:</span>
                                <p
                                    style={{ whiteSpace: "pre-line", position: "relative", left: "-12px", width: "80%" }}
                                    key={feedItem.questionMasterDto.questionId}
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

export default SubmittedQuestionAnswerBlock;
