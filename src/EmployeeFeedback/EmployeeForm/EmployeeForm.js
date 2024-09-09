import React, { useEffect} from 'react'
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
import './EmployeeForm.css'
import SubmittedQuestionAnswerBlock from '../../CommonComponents/EmployeeSubmitted'
import CommonSubmittedbutton from '../../CommonComponents/CommonSubmittedbutton'
import fetchQuestionList from '../../CommonComponents/GetQuestionList'
import ToSubmitQuestionWithAnswer from '../../CommonComponents/customerfeedbackToSubmit';
import Notifications from '../../CommonComponents/ToastMsg';

const EmployeeForm = () => {
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
    fetchQuestionList(3, setQuetionList, setShowLoader)
  }, []);

  let empID = atob(sessionStorage.getItem('employeeID'))


  return (
    <div className="dataDiv">
      <div className="employeeFormWrapper">

        <div className='employeeFormNewDiv'>
          {submitted ? (
            <div
              className="employeeFormmainButtonDiv"
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
                  Feedback  Submitted Successfully
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
          <div className='employeeFormMainOuterDiv'>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>1. Communication Skills</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(0, 1).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.1' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>2. Job Knowledge </span>
              </div>{" "}
              {submitted ? (
                <>
                  {questionList?.slice(1, 2).map((item, i) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.2' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                      />
                  ))}
                </>
              )}
            </div>

            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>3. Quality of Work</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(2, 3).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.3' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>

            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>4. Teamwork</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(3, 4).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.4' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>

            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>5. Problem-solving Skills</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(4, 5).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.5' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>6. Initiative and Proactivity</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(5, 6).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.6' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>7. Dependability and Reliability</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(6, 7).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.7' />
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
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>

            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>8. Adaptability</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(7, 8).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.8' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(7, 8).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='8'
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>9. Leadership Potential (if applicable)</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(8, 9).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.9' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(8, 9).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='9'
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>10. Comments</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(9, 10).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.10' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(9, 10).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='10'
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>11. Overall Performance Rating</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(10, 11).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.11' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(10, 11).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='11'
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
            <div className={`employeeFormcustomerFormouterDiv`}>
              <div className="employeeFormcustomerFormdivHeading">
                <span>12. Additional Feedback</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(11, 12).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId='Q.12' />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(11, 12).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      selectedOptions={selectedOptions}
                      questionId='12'
                      customerFeedbackMasterDto='employeePerformenceMaster'
                      custFeedbackId='empPerformenceId'
                      questionMasterDto='questionMaster'
                      decodedValue={empID} 
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}/>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="employeeFormmainButtonDiv1">
            {submitted ? (
              <></>
            ) : (
              <button
                className="backButton"
                onClick={() => {
                  navigate(`/app/EmployeeGetStarted/${sessionStorage.getItem("employeeID")}`)
                }}
              >
                Back
              </button>
            )}
            {submitted ? (
              <></>
            ) : (
              <CommonSubmittedbutton feedbackDetails={feedbackDetails} notifyFillAgain={notifyFillAgain} handleOpenAddSuccModal={handleOpenAddSuccModal} showLoader={showLoader} notify={notify} setShowLoader={setShowLoader} api={Url.submitEmployeeAnswer} count={12} />
            )}
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={showAddSuccessModal}
        contentLabel="Minimal Modal Example"
        className="customerFormModal customerFormModalHeightBug modalRes"
        overlayClassName="employeeFormOverlay "
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleCloseAddSuccModal}
      >
        <div className="employeeFormdelete_close">
          <img
            src={cancel_btn}
            alt="cancel-btn"
            onClick={handleCloseAddSuccModal}
            style={{width:"30px"}}
          ></img>
        </div>
        <div className="HeroDiv MsgDiv" style={{ position: "relative", top: "-20px" }}>
          {errorShow ? (
            <Lottie animationData={failed} style={style} />
          ) : (
            <Lottie
              animationData={Completed}
              className="employeeFormlottie"
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
        <div className="employeeFormbuttonDivDele">
          <button onClick={handleCloseAddSuccModal} className="employeeFormDeleteClose">
            OK
          </button>
        </div>
      </ReactModal>
      <ToastContainer rtl />
      <ReactModal isOpen={showLoader} contentLabel="Minimal Modal Example" ariaHideApp={false} className="LoaderModal"
        overlayClassName="LoaderOverlay" shouldCloseOnOverlayClick={false}>
        <Lottie animationData={Loader} style={style1} />
      </ReactModal>
    </div>
  )
}

export default EmployeeForm