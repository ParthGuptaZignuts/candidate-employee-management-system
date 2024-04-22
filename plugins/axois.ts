import axios from "axios";

export default defineNuxtPlugin( async () => {
    axios.defaults.baseURL = "http://127.0.0.1:8000/api/"
    axios.interceptors.request.use(function (config) {
        config.headers['token'] = "1|GE2tRzEZgJT1tsjyk07hMtVWJczsnNwVX8UOgL30640f9184"
        return config;
    });
    return {
        provide : {
            axios : axios,
        }
    }
})