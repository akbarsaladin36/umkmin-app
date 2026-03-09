import axios from "axios";

console.log("CEK URL API : ", import.meta.env.VITE_API_BASE_URL);

const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
    withCredentials: true,
});

axiosApi.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosApi.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            if (error.response.status === 401) {
                console.log(error.response);
            }
            if (error.response.status === 403) {
                console.log(error.response);
            }
            if (error.response.status === 500) {
                console.log(error.response);
            }
        }
        return Promise.reject(error);
    },
);

export default axiosApi;
