import React from 'react';

function CommonQuesMaster({ item }) {
  return (
    <>
      {item.questionMaster?.isMcqType === 1 ? (
        <div className="answerDiv1">
          {item?.questionMaster?.mcqOptions?.map((answers, i) => (
            <div className={`checkboxDiv`} key={answers?.mcqOptionId}>
              <input
                type="radio"
                id={`option-${item.questionMaster.questionId}-${i}`}
                value={true}
                checked={item.answer === answers.option}
                readOnly  // Use readOnly instead of onClick={null} to make the radio read-only
              />
              <label
                className='customerFormroundDiv'
                htmlFor={`option-${item.questionMaster.questionId}-${i}`}
              ></label>
              <label htmlFor={`option-${item.questionMaster.questionId}-${i}`} className="surveyLabel">
                {answers?.option}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p className='answer' style={{ whiteSpace: 'pre-line', color: '#000', fontSize: '13px', width: '100%', marginTop: '7px',marginLeft:'13px' }}>{item.answer}</p>
      )}
    </>
  );
}

export default CommonQuesMaster;
