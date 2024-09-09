import React from 'react'

const pdfTimeStamp = () => {
    const getFormatedFileName = (initialString) => {
        let date = new Date();
        let formattedDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        let formattedTime = hours + "." + minutes + "." + seconds + " " + ampm;
        //Extraction Report- 16-9-2023 11.17.28 AM
        return initialString + formattedDate + " " + formattedTime;
    }
    return {
        getFormatedFileName
    }
}

export default pdfTimeStamp