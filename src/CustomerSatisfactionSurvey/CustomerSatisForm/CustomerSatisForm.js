import React, { useEffect } from 'react'
import Lottie from "lottie-react";
import Celebration from "../../CustomerFeedback/Assets/celebration.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Url } from '../../Constants/APIUrlConstant';
import cancel_btn from "../../CustomerFeedback/Assets/cancel.svg";
import ReactModal from "react-modal";
import Completed from "../../CustomerFeedback/Assets/completed.json";
import failed from "../../CustomerFeedback/Assets/failed.json";
import Loader from "../../CustomerFeedback/Assets/loader.json"
import './CustomerSatisForm.css'
import ToSubmitQuestionWithAnswer from '../../CommonComponents/customerfeedbackToSubmit'
import SubmittedQuestionAnswerBlock from '../../CommonComponents/CustomerfeedbackSubmittedQuestion'
import CommonSubmittedbutton from '../../CommonComponents/CommonSubmittedbutton'
import fetchQuestionList from '../../CommonComponents/GetQuestionList'
import Notifications from '../../CommonComponents/ToastMsg';

const CustomerSatisForm = () => {
  const {
    notifyAlertCharacter,
    notifyFillAgain,
    notify,
    handleOpenAddSuccModal,
    handleCloseAddSuccModal,
    style1,
    style,
    submitted,
    feedbackDetails,
    navigate,
    questionList,
    setQuetionList,
    selectedOptions,
    setText,
    showLoader,
    setShowLoader,
    showAddSuccessModal,
    errorShow,
  } = Notifications();


  useEffect(() => {
    fetchQuestionList(2, setQuetionList, setShowLoader)
  }, []);


  let decodedValue = atob(sessionStorage.getItem('SatisfactionId'));

  console.log("feedback....", feedbackDetails)

  return (
    <div className="dataDiv">
      <div className="customerSatisFormWrapper">

        <div className='customerSatisFormNewDiv'>
          {submitted ? (
            <div
              className="customerFormmainButtonDiv"
              style={{ margin: "0 auto", justifyContent: "space-between" }}
            >
              <div className="customerFormfeedbackMessage">
                <small style={{ visibility: "hidden" }}>
                  Feedback Submitted Successfully
                </small>{" "}
                <Lottie animationData={Celebration} className="Celebration" />{" "}
              </div>
              <div className="customerFormfeedbackMessage">
                <small style={{ fontSize: "14px" }}>
                  Feedback Submitted Successfully
                </small>{" "}
              </div>
              <div className="customerFormfeedbackMessage">
                <small style={{ visibility: "hidden" }}>
                  Feedback Submitted Successfully
                </small>{" "}
                <Lottie animationData={Celebration} className="Celebration" />{" "}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className='customerFormMainOuterDiv'>
            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>1. Timeliness of Service Delivery</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(0, 1).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='1' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(0, 1).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='1'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>
            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>2. Quality of Service Provided </span>
              </div>{" "}
              {submitted ? (
                <>
                  {questionList?.slice(1, 2).map((item, i) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='2' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(1, 2).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='2'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>

            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>3. Communication with Our Team</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(2, 3).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='3' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(2, 3).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='3'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>

            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>4. Resolution of Issues</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(3, 4).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='4' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(3, 4).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='4'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>

            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>5. Professionalism of Our Team</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(4, 5).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='5' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(4, 5).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='5'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>
            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>6. Overall Satisfaction</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(5, 6).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='6' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(5, 6).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='6'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>
            <div className={`customerFormouterDiv`}>
              <div className="customerFormdivHeading">
                <span>7. Comments</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(6, 7).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='7' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(6, 7).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='7'
                      customerFeedbackMasterDto='customerSatisfactionMasterDto'
                      custFeedbackId='custSatisfactionId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={decodedValue}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="customerFormmainButtonDiv1">
            {submitted ? (
              <></>
            ) : (
              <button
                className="backButton"
                onClick={() => {
                  navigate(`/app/CustomerSatisfactionGetStarted/${sessionStorage.getItem('SatisfactionId')}`)
                }}
              >
                Back
              </button>
            )}
            {submitted ? (
              <></>
            ) : (
              <CommonSubmittedbutton feedbackDetails={feedbackDetails} notifyFillAgain={notifyFillAgain} handleOpenAddSuccModal={handleOpenAddSuccModal} showLoader={showLoader} notify={notify} setShowLoader={setShowLoader} api={Url.customerSatisfactionSubmitFeedback} count={7} />
            )}
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={showAddSuccessModal}
        contentLabel="Minimal Modal Example"
        className="customerFormModal customerFormModalHeightBug modalRes"
        overlayClassName="customerFormOverlay"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleCloseAddSuccModal}
      >
        <div className="customerFormdelete_close">
          <img
            src={cancel_btn}
            alt="cancel-btn"
            onClick={handleCloseAddSuccModal}
            style={{width:"30px"}}
          ></img>
        </div>
        <div className="HeroDiv MsgDiv" style={{ position: "relative", top: '-17px' }}>
          {errorShow ? (
            <Lottie animationData={failed} style={style} />
          ) : (
            <Lottie
              animationData={Completed}
              className="customerFormlottie"
              style={style}
            />
          )}
          {errorShow ? (
            <span className="popupMsgSpan">Fill Required Details</span>
          ) : (
            <span className="popupMsgSpan">
              Feedback Submitted Successfully !
            </span>
          )}
        </div>
        <div className="customerFormbuttonDivDele">
          <button onClick={handleCloseAddSuccModal} className="customerFormDeleteClose">
            OK
          </button>
        </div>
      </ReactModal>
      <ToastContainer rtl />
      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" className="LoaderModal" ariaHideApp={false}
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style1} />
      </ReactModal>
    </div>
  )
}

export default CustomerSatisForm