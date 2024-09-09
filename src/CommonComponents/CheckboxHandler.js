import React from 'react';

const CheckboxHandler = ({ question, idRange, selectedCheckboxes, setSelectedCheckboxes, array, setArray }) => {


    const handleCheckboxChange = () => {
        let id = question?.questionMaster?.questionId;
        const updatedCheckboxes = [...selectedCheckboxes];
        const updatedArray = [...array];

        if (!updatedCheckboxes.includes(question)) {
            if (idRange.includes(id)) {
                updatedArray.push(question);
                updatedArray.sort((a, b) => a.questionMaster.questionId - b.questionMaster.questionId); // Sort by id
                setArray(updatedArray);
            }
            updatedCheckboxes.push(question);
        } else {
            const index = updatedArray.findIndex(item => item?.questionMaster?.questionId === id);
            if (index !== -1) {
                updatedArray.splice(index, 1);
                updatedArray.sort((a, b) => a.questionMaster.questionId - b.questionMaster.questionId); // Sort by id
                setArray(updatedArray);
            }
            updatedCheckboxes.splice(updatedCheckboxes.indexOf(question), 1);
        }

        setSelectedCheckboxes(updatedCheckboxes);
    };


    const isCheckboxSelected = (question) => {
        return selectedCheckboxes?.includes(question);
    };

    return (
        <input
            style={{ marginRight: '10px', marginTop: '4px' }}
            type="checkbox"
            id={`checkbox-${question.questionId}`}
            checked={isCheckboxSelected(question)}
            onChange={handleCheckboxChange}
        />
    );
};

export default CheckboxHandler;