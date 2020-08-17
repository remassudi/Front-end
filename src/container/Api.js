import axios from 'axios';
import AppConfig from '../constants/AppConfig';

let instance = axios.create({
    baseURL:  AppConfig.api_baseURL
});

instance.interceptors.response
    .use((response) => {
    return response;
    },
    function (error) {
        if (parseInt(error.response.status) === 401) {
            if (!window.location.pathname.toLowerCase().includes("session/")) {
                localStorage.setItem("lastPath", window.location.pathname);
                window.location.href = "/session/login";
            }
        }
        return Promise.reject(error);
    });

export default instance;