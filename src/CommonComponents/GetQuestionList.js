import { Url } from "../Constants/APIUrlConstant";

 const fetchQuestionList = async (formType, setQuetionList, setShowLoader) => {
    setShowLoader(true)
    fetch(Url.questionList.replace('{formType}', formType), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((respone) => respone.json())
      .then((data) => {
        console.log("datttttt",data)
        setShowLoader(false)
        let arr = [];
        data?.DATA?.map((item, i) => {
          let obj = { ...item, answer: "" };
          arr.push(obj);
        })
        setQuetionList(arr);

      });
  }

  export default fetchQuestionList;