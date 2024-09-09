import React, { useContext, useEffect, useState } from 'react';
import { contextData } from '../Context/MyContext';

const ToSubmitQuestionWithAnswer = ({ item, questionId, decodedValue, customerFeedbackMasterDto, custFeedbackId, questionMasterDto, setQuetionList, setText, notifyAlertCharacter, questionList }) => {

    const [selectedOptions, setSelectedOptions] = useState({});
    const { setFeedbackDetails, feedbackDetails } = useContext(contextData)

    // Function calls when user clicked on radio buttons 
    const handleRadioChange = (questionId, index, answer) => {
        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [questionId]: index,
        }));

        const newFeedback = {
            answer: answer,
            [customerFeedbackMasterDto]: {
                [custFeedbackId]: decodedValue,
            },
            [questionMasterDto]: {
                questionId: questionId,
            },
        };

        setFeedbackDetails((prevDetails) => {
            const isQuestionIdPresent = prevDetails.some(
                (item) => item?.[questionMasterDto]?.questionId === questionId
            );

            if (isQuestionIdPresent) {
                const questionIndex = prevDetails.findIndex(
                    (item) => item?.[questionMasterDto]?.questionId === questionId
                );
                return [
                    ...prevDetails.slice(0, questionIndex),
                    newFeedback,
                    ...prevDetails.slice(questionIndex + 1),
                ];
            } else {
                return [...prevDetails, newFeedback];
            }
        });
    };

    useEffect(() => {
        sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
    }, [selectedOptions]);

    const handleChange = (e, questionId) => {
        console.log("handleChange", e, questionId);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";

        let answer = e.target?.value?.trim();

        // Early exit if the answer starts with a space
        if (e.target.value.startsWith(" ")) {
            setText("");
            notifyAlertCharacter();
            return;
        }

        // Update the question list
        const updatedQuestionList = questionList?.map((item) =>
            item?.questionId === questionId ? { ...item, answer: e.target.value } : item
        );
        setQuetionList(updatedQuestionList);
        setText(e.target.value);

        // Update the feedback details
        const isQuestionIdPresent = feedbackDetails.some(
            (item) => item?.[questionMasterDto]?.questionId === questionId
        );
        const questionIndex = feedbackDetails.findIndex(
            (item) => item?.[questionMasterDto]?.questionId === questionId
        );
        const updatedFeedback = {
            answer: answer,
            [customerFeedbackMasterDto]: {
                [custFeedbackId]: decodedValue,
            },
            [questionMasterDto]: {
                questionId: questionId,
            },
        };

        if (isQuestionIdPresent) {
            setFeedbackDetails((prevDetails) => [
                ...prevDetails.slice(0, questionIndex),
                updatedFeedback,
                ...prevDetails.slice(questionIndex + 1),
            ]);
        } else {
            setFeedbackDetails((prevDetails) => [
                ...prevDetails,
                updatedFeedback,
            ]);
        }
    };


    return (
        <div className="mainContentDiv" key={item.questionId}>
            <div className="questionDiv">
                <span className="questionDetails pro">
                    {questionId}. {item.question}{" "}
                    <span className="bug_star">*</span>
                </span>
            </div>
            {item.isMcqType === 1 ? (
                <div className="answerDiv">
                    {item.mcqOptionsDtos.map((answers, i) => (
                        <div className={`checkboxDiv`} key={answers?.mcqOptionId}>
                            <input
                                type="radio"
                                id={`option-${item.questionId}-${i}`}
                                name={`question-${item.questionId}`}
                                value={answers.option}
                                onClick={() =>
                                    handleRadioChange(
                                        item.questionId,
                                        i,
                                        answers.option
                                    )
                                }
                            />
                            <label
                                className={`roundDiv ${selectedOptions[item.questionId] == i ? "filled" : ""}`}
                                htmlFor={`option-${item.questionId}-${i}`}
                            ></label>
                            <label htmlFor={`option-${item.questionId}-${i}`} className="surveyLabel">
                                {answers.option}
                            </label>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="cs_answerDivNext">
                    <textarea
                        className="textArea"
                        placeholder="Type Here"
                        style={{ minHeight: "50px" }}
                        value={item?.answer}
                        onChange={(e) => {
                            handleChange(e, item.questionId);
                        }}
                    ></textarea>
                    <small className="hint"></small>
                </div>
            )}
        </div>
    );
};

export default ToSubmitQuestionWithAnswer;
