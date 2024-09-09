
import React from 'react'

function CommonfelidDataques({item}) {
  return (
    <>

{item.questionMaster.isMcqType === 1 ? (
                    <div className="answerDiv1">
                      {item?.questionMaster?.mcqOptions?.map((answers, i) => (
                        <div className={`checkboxDiv`} key={answers?.mcqOptionId}>
                          <input
                            type="radio"
                            id={`option-${item.questionMaster.questionId}-${i}`}
                            name={`question-${item.questionMaster.questionId}`}
                            value={true}
                            checked={item.answer === answers.option} 
                            onChange={() => { }}
                            onClick={null} 
                          />
                          
                          <label htmlFor={`option-${item.questionMaster.questionId}-${i}`} className="surveyLabel">
                            {answers?.option}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='answer' style={{ whiteSpace: 'pre-line', color: '#000', fontSize: '13px',width:'86%',marginLeft:'12px', marginTop: '7px' }}>{item.answer}</p>
                  )}
    </>
  )
}

export default CommonfelidDataques