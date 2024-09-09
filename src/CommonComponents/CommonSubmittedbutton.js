import React, { useContext } from 'react';
import { contextData } from '../Context/MyContext';
import { Url } from '../Constants/APIUrlConstant';

const CommonSubmittedbutton = ({ feedbackDetails, notifyFillAgain, handleOpenAddSuccModal, notify, setShowLoader, api, count }) => {
    const { setSubmitted } = useContext(contextData);

    const handleSubmitData = () => {

        let finalFeebackDetails = feedbackDetails.filter((item)=>{return item.answer != ''})
        console.log("finalFeebackDetails+++",finalFeebackDetails);
        if (finalFeebackDetails?.length == count) {
            setShowLoader(true);
            try {
                fetch(api, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': "application/json",
                        "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
                    },
                    body: JSON.stringify(finalFeebackDetails),
                })
                .then((response) => response.json())
                .then((res) => {
                    setShowLoader(false);
                    if (!res?.SUCCESS) {
                        notifyFillAgain(); // Notify again function if submission fails
                    } else {
                        handleOpenAddSuccModal();
                        setSubmitted(true);
                        window.scrollTo({
                            top: document.body.scrollHeight - window.innerHeight,
                            behavior: "smooth",
                        });
                    }
                })
                .catch((err) => {
                    console.log("Submit Error", err);
                    setShowLoader(false);
                });
            } catch (error) {
                console.log("Submit Error", error);
                setShowLoader(false);
            }
        } else {
            notify(); // Notify function for insufficient feedback details
        }
    };

    return (
        <button
            className="nextButton"
            onClick={() => {
                handleSubmitData();
            }}
        >
            Submit
        </button>
    );
};

export default CommonSubmittedbutton;
