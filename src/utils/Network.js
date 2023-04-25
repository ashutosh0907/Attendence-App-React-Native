import { getObjByKey } from "./Storage";
export const POSTNETWORK = async (url, payload, token = false, content = false) => {

    let headers = {
        'Accept': 'application/json',
        'Content-Type': content ? 'multipart/form-data' : 'application/json'
    };
    if (token) {
        let loginRes = await getObjByKey('loginResponse');
        // console.log(loginRes.token)
        headers = { ...headers, Authorization: "Bearer " + loginRes.token }
    }
    // console.log(payload)
    return await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    }).then((response) => response.json())
        .then((response) => {
            return response
        }).catch(error => {
            console.error('error' + error);
        });

}

export const GETNETWORK = async (url, token = false) => {

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (token) {
        let loginRes = await getObjByKey('loginResponse');
        // console.log(loginRes)
        headers = { ...headers, Authorization: "Bearer " + loginRes.token }
    }
    return fetch(url, {
        method: 'GET',
        headers: headers
    })
        .then((response) => response.json())
        .then(response => {
            return response
        }).catch(error => {
            console.error(error);
        });
}

