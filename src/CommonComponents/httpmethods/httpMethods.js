
// POST method for login and tokenParse
export const LOGIN_POST = async (URL, body) => {
    const res = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(body)
    });

    return res.json();
}

// For API's with token 

// GET method
export const GET = async (URL, token) => {
    const res = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token ,
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
    });
    return res.json();
}


// POST method
export const POST = async (URL, token, body) => {
    const res = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + token ,
             "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
        body: JSON.stringify(body)
    });

    return res.json();
}


export const POSTWithoutToken = async (URL, body) => {
    const res = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
        body: JSON.stringify(body)
    });

    return res.json();
}

// PUT method
export const PUT = async (URL, token, body) => {
    const res = await fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + token,
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
        body: JSON.stringify(body)
    });

    return res.json();
}

export const PUTWithoutToken = async (URL, body) => {
    const res = await fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
        body: JSON.stringify(body)
    });

    return res.json();
}






// Delete method
export const DELETE = async (URL, token , body) => {
    const res = await fetch(URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
            "X-CSRF-Token": "YmUyYjAzODItOGIyZi00Njk1LThhOGMtYjhkYzVmZDY0YjI2"
        },
        body: JSON.stringify(body)
    });
    return res.json();
}

