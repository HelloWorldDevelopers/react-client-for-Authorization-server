import { useNavigate } from "react-router-dom";
import "./CustomerSatisfactionSurvey.css";
import { useEffect, useState, useContext } from "react";
import { Url } from "../../Constants/APIUrlConstant";
import { contextData } from "../../Context/MyContext";
import Lottie from "lottie-react";
import cancel_btn from "../Assets/cancel.svg";
import ReactModal from "react-modal";
import Completed from "../Assets/completed.json";
import Celebration from "../Assets/celebration.json";
import failed from "../Assets/failed.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Assets/loader.json"
import ToSubmitQuestionWithAnswer from '../../CommonComponents/customerfeedbackToSubmit'
import SubmittedQuestionAnswerBlock from '../../CommonComponents/CustomerfeedbackSubmittedQuestion'
import CommonSubmittedbutton from "../../CommonComponents/CommonSubmittedbutton";
import fetchQuestionList from '../../CommonComponents/GetQuestionList'
import exlamentory from '../../CustomerFeedback/Assets/exclamation-mark.png'
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';

function CustomerSatisfactionSurvey() {
  const [questionList, setQuetionList] = useState([]);
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({});
  const { setFeedbackDetails, feedbackDetails } = useContext(contextData);
  const [showAddSuccessModal, setshowAddSuccessModal] = useState(false);
  const { submitted } = useContext(contextData);
  const [showLoader, setShowLoader] = useState(false);
  const handleOpenAddSuccModal = () => {
    setshowAddSuccessModal(true);
  };
  const handleCloseAddSuccModal = () => {
    setshowAddSuccessModal(false);
  };

  const style1 = {
    width: "25%",
    margin: "0 auto",
  };

  const decodedValue = sessionStorage.getItem("customerId");

  const style = {
    width: "50%",
    height: "78px",
    margin: "0 auto",
  };

  const notify = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={exlamentory} alt="Custom Icon" className="custom-swal-icon1" />
    );
    Swal.fire({

      title: 'Please Fill Required Details!',
      html: imageHtml,
      allowOutsideClick: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-ok-button',
      },
      timer: 2000,
      showConfirmButton: false,

    });
  };
  const notifyFillAgain = () => {
    const imageHtml = ReactDOMServer.renderToStaticMarkup(
      <img src={exlamentory} alt="Custom Icon" className="custom-swal-icon1" />
    );
    Swal.fire({

      title: 'Feedback Already Filled',
      html: imageHtml,
      allowOutsideClick: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-ok-button',
      },

      timer: 2000, // Close after 2 minutes (120000 milliseconds)
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    fetchQuestionList(1, setQuetionList, setShowLoader)
  }, []);

  const [pageStatus, setPageStatus] = useState("first");
  const [, setText] = useState("");
  const [errorShow] = useState(false);

  const notifyAlertCharacter = () => {
    toast.dismiss();
    toast.error("Blank Space are not allowed");
  };

  const handleChange = (e, questionId) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
    let answer = e.target.value?.trim();

    const isAnswerEmpty = answer === "";
    if (isAnswerEmpty || answer.startsWith(" ")) {
      setText('');
      notifyAlertCharacter();
    } else {
      updateQuestionList(questionId, answer);
      setText(answer);
      updateFeedbackDetails(questionId, answer);
    }
  };

  const updateQuestionList = (questionId, answer) => {
    const updatedQuestionList = questionList?.map((item) => {
      if (item?.questionId === questionId) {
        return { ...item, answer: answer };
      }
      return item;
    });
    setQuetionList(updatedQuestionList);
  };

  const updateFeedbackDetails = (questionId, answer) => {
    const updatedDetail = {
      answer: answer,
      customerFeedbackMasterDto: {
        custFeedbackId: sessionStorage.getItem("custFeedbackId"),
      },
      questionMasterDto: { questionId: questionId },
    };

    const isQuestionIdPresent = feedbackDetails.some(
      (item) => item?.questionMasterDto?.questionId === questionId
    );
    const questionIndex = feedbackDetails.findIndex(
      (item) => item?.questionMasterDto?.questionId === questionId
    );

    const updatedDetails =
      isQuestionIdPresent
        ? [
          ...feedbackDetails.slice(0, questionIndex),
          updatedDetail,
          ...feedbackDetails.slice(questionIndex + 1),
        ]
        : [...feedbackDetails, updatedDetail];

    setFeedbackDetails(updatedDetails);
  };

  return (
    <div className="dataDiv">
      <div className="customerSatisSurvWrapper">
        <div className="customerSatisNewDiv">
          {submitted ? (
            <div
              className="mainButtonDiv"
              style={{ margin: "0 auto", justifyContent: "space-between", display: "flex", padding: "1% 0%" }}
            >
              <div className="feedbackMessage">
                <small style={{ visibility: "hidden" }}>
                  Feedback Submitted Successfully
                </small>{" "}
                <Lottie animationData={Celebration} className="Celebration" />{" "}
              </div>
              <div className="feedbackMessage">
                <small style={{ fontSize: "14px" }}>
                  Feedback Submitted Successfully
                </small>{" "}
              </div>
              <div className="feedbackMessage">
                <small style={{ visibility: "hidden" }}>
                  Feedback Submitted Successfully
                </small>{" "}
                <Lottie animationData={Celebration} className="Celebration" />{" "}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="customerFeedbacMainDiv">
            <div className={`customerSatisInnerDiv`}>
              <div className="customerFormdivHeading">
                <span>1. Project Management & Execution</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(0, 4).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId={item.questionId} />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(0, 4).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      handleChange={handleChange}
                      selectedOptions={selectedOptions}
                      questionId={item.questionId}
                      customerFeedbackMasterDto='customerFeedbackMasterDto'
                      custFeedbackId='custFeedbackId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={sessionStorage.getItem("custFeedbackId")}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>
            <div className={`customerSatisInnerDiv`}>
              <div className="customerFormdivHeading">
                <span>2. Quality of Deliverables </span>
              </div>{" "}
              {submitted ? (
                <>
                  {questionList?.slice(4, 8).map((item, i) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId={item.questionId} />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(4, 8).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      handleChange={handleChange}
                      selectedOptions={selectedOptions}
                      questionId={item.questionId}
                      customerFeedbackMasterDto='customerFeedbackMasterDto'
                      custFeedbackId='custFeedbackId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={sessionStorage.getItem("custFeedbackId")}
                      setQuetionList={setQuetionList}
                      setText={setText}
                      questionList={questionList}
                      notifyAlertCharacter={notifyAlertCharacter}
                    />
                  ))}
                </>
              )}
            </div>

            <div className={`customerSatisInnerDiv`}>
              <div className="customerFormdivHeading">
                <span>3. Team Competence</span>
              </div>
              {submitted ? (
                <>
                  {questionList?.slice(-5).map((item) => (
                    <SubmittedQuestionAnswerBlock key={item.questionId} item={item} feedbackDetails={feedbackDetails} questionId={item.questionId} />
                  ))}
                </>
              ) : (
                <>
                  {questionList?.slice(-5).map((item) => (
                    <ToSubmitQuestionWithAnswer
                      key={item.questionId}
                      item={item}
                      handleChange={handleChange}
                      selectedOptions={selectedOptions}
                      questionId={item.questionId}
                      customerFeedbackMasterDto='customerFeedbackMasterDto'
                      custFeedbackId='custFeedbackId'
                      questionMasterDto='questionMasterDto'
                      decodedValue={sessionStorage.getItem("custFeedbackId")}
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
          <div className="customerSurveymainButtonDiv">
            {submitted ? (
              <></>
            ) : (
              <button
                className="backButton"
                onClick={() => {
                  pageStatus == "first"
                    ? navigate(`/app/GetStarted/${decodedValue}`)
                    : setPageStatus("first");
                }}
              >
                Back
              </button>
            )}
            {submitted ? (
              <></>
            ) : (
              <CommonSubmittedbutton feedbackDetails={feedbackDetails} notifyFillAgain={notifyFillAgain} handleOpenAddSuccModal={handleOpenAddSuccModal} showLoader={showLoader} notify={notify} setShowLoader={setShowLoader} api={Url.submitFeedBack} count={13} />
            )}
          </div>
        </div>
      </div>

      <ReactModal
        isOpen={showAddSuccessModal}
        contentLabel="Minimal Modal Example"
        className="Modal ModalHeightBug modalRes"
        overlayClassName="Overlay"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleCloseAddSuccModal}
      >
        <div className="delete_close">
          <img
            src={cancel_btn}
            alt="cancel-btn"
            onClick={handleCloseAddSuccModal}
            style={{ width: "30px" }}
          ></img>
        </div>
        <div className="HeroDiv MsgDiv1" style={{ position: "relative" }}>
          {errorShow ? (
            <Lottie animationData={failed} style={style} />
          ) : (
            <Lottie
              animationData={Completed}
              className="lottie"
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
        <div className="buttonDivDele">
          <button onClick={handleCloseAddSuccModal} className="DeleteClose">
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
  );
}

export default CustomerSatisfactionSurvey;
