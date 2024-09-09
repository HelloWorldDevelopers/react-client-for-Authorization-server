import { useEffect } from 'react'

function CommonEmployeefelid(Url, decode, setShowLoader, setLoginDetails, loginDetails) {

    useEffect(() => {
        setShowLoader(true)
        fetch(
            Url.getEmployeeDetailsById.replace("{id}", decode),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: "Bearer " + sessionStorage.getItem('token'),
                    "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
                },
            }
        )
            .then((respone) => respone.json())
            .then((data) => {
                setShowLoader(false)
                console.log("employee login details", data)
                setLoginDetails({
                    ...loginDetails,
                    ['name']: data?.DATA?.employeeMaster.fullName,
                    ['projectName']: data?.DATA?.project?.projectName,
                    ['projectManager']: data?.DATA?.projectManagerName,
                    ['email']: data?.DATA?.projectManagerEmail,
                    ['date']:data?.DATA?.filledDate
                    
                })
                sessionStorage.setItem('feedbackBy', data?.DATA?.feedbackBy)
                sessionStorage.setItem("empName",data?.DATA?.projectTeam?.employeeMaster?.fullName)
                        });
    }, [Url, decode, setShowLoader]);
}

export default CommonEmployeefelid
