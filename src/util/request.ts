import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { getToken } from "./tokenHelper";


const service = axios.create({
  baseURL:
    import.meta.env.MODE == "development" || import.meta.env.MODE == "stage"
      ? "https://mockapi.eolink.com/Q6Ez8L3bcaea568a96d346ce34bfc7c7603b3f80180e574"
      // "http://52.83.157.35:8028" // 测试
      : "http://52.83.157.35:8028", // 正式
  timeout: 1000 * 120,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers != undefined) {
      config.headers.Authorization =getToken();
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log("API ERROR:" + error);
    return Promise.reject(error);
  }
);


export default service;
