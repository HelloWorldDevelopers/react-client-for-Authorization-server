import React, { useState, useEffect } from 'react';

const DetailDivNextSatisfaction = ({
    setSelectedFields,
    selectedFields,
    setSelectedFieldsWithLabels,
    label1, label2, label3, label4, label5, label6,
    value1, value2, value3, value4, value5, value6
}) => {

    useEffect(() => {
        setSelectedFields({
            field1: !!label1,
            field2: !!label2,
            field3: !!label3,
            field4: !!label4,
            field5: !!label5,
            field6: !!label6,
        });

        setSelectedFieldsWithLabels({
            ...(label1 && { [label1]: value1 }),
            ...(label2 && { [label2]: value2 }),
            ...(label3 && { [label3]: value3 }),
            ...(label4 && { [label4]: value4 }),
            ...(label5 && { [label5]: value5 }),
            ...(label6 && { [label6]: value6 }),
        });
    }, [label1, label2, label3, label4, label5, label6, value1, value2, value3, value4, value5, value6]);

    const handleCheckboxChange = (fieldKey, value, label) => {
        setSelectedFields(prevSelectedFields => ({
            ...prevSelectedFields,
            [fieldKey]: !prevSelectedFields[fieldKey]
        }));

        setSelectedFieldsWithLabels(prevSelectedFieldsWithLabels => {
            if (selectedFields[fieldKey]) {
                const { [label]: omit, ...rest } = prevSelectedFieldsWithLabels;
                return rest;
            } else {
                return {
                    ...prevSelectedFieldsWithLabels,
                    [label]: value
                };
            }
        });
    };

    const getLabelWidth = (label, label1) => {
        if (label === 'Employee Name' || label === 'Project Name' || label === 'Project Manager' || label === 'Email ID' || (label === 'Filled On' && label1 === 'Employee Name')) {
            return '31%';
        } else {
            return '18%';
        }
    };

    return (
        <div className='detailDivNextSatisfaction'>
            <div className='detailFirstDiv'>
                {label1 && (
                    <div className='detailInnerFirstDiv' key="field1">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field1"]}
                            onChange={() => handleCheckboxChange("field1", value1, label1)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label1, label1), fontSize: '13px' }}>{label1}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value1}</div>
                    </div>
                )}
                {label2 && (
                    <div className='detailInnerFirstDiv' key="field2">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field2"]}
                            onChange={() => handleCheckboxChange("field2", value2, label2)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label2, label1), fontSize: '13px' }}>{label2}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value2}</div>
                    </div>
                )}
                {label3 ? (
                    <div className='detailInnerFirstDiv' key="field3">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field3"]}
                            onChange={() => handleCheckboxChange("field3", value3, label3)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label3, label1), fontSize: '13px' }}>{label3}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value3}</div>
                    </div>
                )
                    :
                    label6 &&
                    <div className='detailInnerFirstDiv' key="field6">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field6"]}
                            onChange={() => handleCheckboxChange("field6", value6, label6)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label6, label1), fontSize: '13px' }}>{label6}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value6}</div>
                    </div>
                }
            </div>
            <div className='detailSecondDiv'>
                {label4 && (
                    <div className='detailInnerFirstDiv' key="field4">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field4"]}
                            onChange={() => handleCheckboxChange("field4", value4, label4)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label4, label1), fontSize: '13px' }}>{label4}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value4}</div>
                    </div>
                )}
                {label5 && (
                    <div className='detailInnerFirstDiv' key="field5">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field5"]}
                            onChange={() => handleCheckboxChange("field5", value5, label5)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label5, label1), fontSize: '13px' }}>{label5}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value5}</div>
                    </div>
                )}
                {(label6 && label3) && (
                    <div className='detailInnerFirstDiv' key="field6">
                        <input
                            style={{ width: '2%' }}
                            type="checkbox"
                            checked={selectedFields["field6"]}
                            onChange={() => handleCheckboxChange("field6", value6, label6)}
                        />
                        <div style={{ fontWeight: 600, marginLeft: "9px", width: getLabelWidth(label6, label1), fontSize: '13px' }}>{label6}</div>
                        <div className='detailColon'>:</div>
                        <div style={{ width: '100%', fontSize: '12px', marginLeft: '12px' }}>{value6}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailDivNextSatisfaction;
