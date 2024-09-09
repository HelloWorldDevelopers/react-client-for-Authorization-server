import React from 'react'
import { toast } from "react-toastify";

function CommonQues({ submitted, questionList, SubmittedQuestionAnswerBlock, feedbackDetails, ToSubmitQuestionWithAnswer, selectedOptions, setQuetionList, setText, decodedValue, questionId, slice1, slice2, custFeedbackId, questionMasterDto, customerFeedbackMasterDto }) {

    const notifyAlertCharacter = () => {
        toast.dismiss();
        toast.error("Blank Space, Digits And Special Charcters Are Not Allowed");
    };
    const slicedQuestionList = Array.isArray(questionList) ? questionList.slice(slice1, slice2) : [];

    return (
        <>
            {submitted ? (
                <>
                    {slicedQuestionList.map((item) => {
                    console.log("feedbackDetails:",feedbackDetails)
                        return (
                            <>
                                <SubmittedQuestionAnswerBlock 
                                key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId={questionId} />
                            </>
                        )
                    })}
                </>
            ) : (
                <>
                    {questionList?.slice(slice1, slice2).map((item) => (
                        <ToSubmitQuestionWithAnswer
                            key={item.questionId}
                            item={item}
                            selectedOptions={selectedOptions}
                            questionId={questionId}
                            customerFeedbackMasterDto={customerFeedbackMasterDto}
                            custFeedbackId={custFeedbackId}
                            questionMasterDto={questionMasterDto}
                            decodedValue={decodedValue}
                            setQuetionList={setQuetionList}
                            setText={setText}
                            questionList={questionList}
                            notifyAlertCharacter={notifyAlertCharacter}
                        />
                    ))}
                </>
            )}
        </>
    )
}

export default CommonQues
