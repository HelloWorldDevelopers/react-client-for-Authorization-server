import React, { useState } from 'react';
import DetailDivNextSatisfaction from './CheckboxForAllPrimaryInfo';

const ParentComponent = () => {
    const initialSelectedFields = {
        field1: true,
        field2: true,
        field3: true,
        field4: true,
        field5: true,
        field6: true,
    };

    const initialSelectedFieldsWithLabels = {
        "Label 1": "Value 1",
        "Label 2": "Value 2",
        "Label 3": "Value 3",
        "Label 4": "Value 4",
        "Label 5": "Value 5",
        "Label 6": "Value 6",
    };

    const [selectedFields, setSelectedFields] = useState(initialSelectedFields);
    const [selectedFieldsWithLabels, setSelectedFieldsWithLabels] = useState(initialSelectedFieldsWithLabels);

    return (
        <DetailDivNextSatisfaction
            loginDetails
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
            setSelectedFieldsWithLabels={setSelectedFieldsWithLabels}
            label1="Label 1"
            label2="Label 2"
            label3="Label 3"
            label4="Label 4"
            label5="Label 5"
            label6="Label 6"
            value1="Value 1"
            value2="Value 2"
            value3="Value 3"
            value4="Value 4"
            value5="Value 5"
            value6="Value 6"
        />
    );
};

export default ParentComponent;
