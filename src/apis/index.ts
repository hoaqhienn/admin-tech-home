import axios from 'axios';

// get token from local storage
const getToken = async () => {
    const token = localStorage.getItem('authState');
    return token ? JSON.parse(token).token : null;
};

export const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 6000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async function (config) {
        const token = await getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.params = {
            ...config.params,
            // locale: getDeviceLanguage(),
        };
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response.data;
    },
    function (error) {
        if (error.response) {
            if (error.response.status === 403) {
                //logout
            }
            if (error.response.status === 401) {
                // _retrieveData('login_data').then(data => {
                //     if (data) {
                //         error.config.headers.Authorization =
                //             'Bearer ' + data.token;
                //         return api(error.config);
                //     }
                // });
            }
        }

        return Promise.reject(error);
    },
);