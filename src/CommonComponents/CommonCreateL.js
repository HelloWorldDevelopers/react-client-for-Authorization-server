import React from 'react'

function CommonCreateL(EmailSendAlertSuccess,EmailSendErrorSuccess,EmailSendSuccess,params, url,id) {
  console.log('id',id)
console.log( "params ---------------" , params)
    const handleSend = () => {
        if (params?.filled) {
          EmailSendAlertSuccess();
        }else {
            fetch(url.replace("{id}", id), {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: "Bearer " + sessionStorage.getItem('token'),
                "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
              },
            }).then((resp) => resp.json())
              .then((res) => {
                if (res.SUCCESS) {
                  EmailSendSuccess();
                } else {
                  EmailSendErrorSuccess(res.MESSAGE);
                }
              })
              .catch((e) => {
                console.log(e);
              })
        }
      }
      handleSend()
      return(
        <></>
      )
}

export default CommonCreateL
