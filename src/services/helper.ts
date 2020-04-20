const apiUrl = "http://localhost:5000";

const getAuth = () => {
    return {}
}

const showLoader = () => {

}

const hideLoader = () => {

}

const tryParseText = (text:string) => text ? JSON.parse(text) : {};

function request<T>(method: string, path: string, body?: string, isShowLoader: boolean = true): Promise<T> {
    
    isShowLoader && showLoader();
    const url = apiUrl + path;
    const headers = {"Content-Type": "application/json", ...getAuth() }
    return fetch(url, {method, headers, body })
    .then(response => {
        console.log(response)
        if (response.ok)
            return response.text().then(tryParseText);
        else
            return response.text().then(tryParseText).then(e => Promise.reject(e));
    })
    .then(e => {
        hideLoader();
        return e;
    })
    .catch(e => {
        hideLoader();
        return Promise.reject(e);
    })    
}

export const get = <T>(path: string) => request<T>("GET", path);
export const post = <T>(path: string, body?: string) => request<T>("POST", path, body);
export const put = <T>(path: string, body?: string) => request<T>("PUT", path, body);
export const _delete = <T>(path: string, body?: string) => request<T>("DELETE", path, body);