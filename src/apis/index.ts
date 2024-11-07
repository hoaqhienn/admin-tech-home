import axios from 'axios';

// get token from local storage
const getToken = async () => {
  const token = localStorage.getItem('_token');
  if (token) {
    return JSON.parse(token);
  }
  return null;
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
        window.location.href = '/auth/signin';
      }
      if (error.response.status === 401) {
        window.location.href = '/auth/signin';
      }
    }

    return Promise.reject(error);
  },
);
