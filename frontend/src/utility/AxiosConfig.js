// ** Axios
import axios from 'axios';

// ** Utils
import { getAccessToken, getCurrentUser, logoutCurrentUser } from "./Utils";

// ** Constant
import { hostRestApiUrl, hostRestApiPrefix } from './reduxConstant';

const instance = axios.create({
    baseURL: `${hostRestApiUrl}${hostRestApiPrefix}`
});

// For GET requests
instance.interceptors.request.use((req) => {
    const currentUser = getCurrentUser();
    const token = getAccessToken();
    if (currentUser?._id && token) {
        req.headers['x-access-token'] = token;
    }

    // Add configurations here
    return req;
}, (err) => {
    return Promise.reject(err);
})

// For POST requests
instance.interceptors.response.use((res) => {
    // Add configurations here
    if (res.status === 201) {
        console.log('Posted Successfully');
    }

    return res
}, (error) => {
    let status = error?.status
    if (error?.response?.status) {
        status = error.response.status
    }

    if (status === 401) {
        logoutCurrentUser();
        window.location.reload();
    }

    return Promise.reject(error);
})

export default instance;
