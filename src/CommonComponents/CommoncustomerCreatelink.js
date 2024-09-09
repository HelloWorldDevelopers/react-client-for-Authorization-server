import React from 'react'

function CommoncustomerCreatelink(rowData, sortType, setRowData) {
  console.log("CommoncustomerCreatelink",rowData,setRowData)
  const handleSortFilledValues = () => {
    const finalData = [];
    const filled = [];
    const nonFilled = [];
    rowData?.forEach((item) => {
      if (item?.filled) {
        filled?.push(item)
      }
      else {
        nonFilled?.push(item)
      }
    })
    if (sortType) {
      nonFilled?.forEach((row) => { finalData.push(row) })
      filled?.forEach((row) => { finalData.push(row) });
      setRowData(finalData);
    }
    else {
      filled?.forEach((row) => { finalData.push(row) });
      nonFilled?.forEach((row) => { finalData.push(row) })
      setRowData(finalData);
    }
  }
  
  handleSortFilledValues();

  return (
    <>
    </>
  )
}

export default CommoncustomerCreatelink
