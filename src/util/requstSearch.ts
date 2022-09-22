import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

const service = axios.create({
  baseURL:
    import.meta.env.MODE == "development" || import.meta.env.MODE == "stage"
      ? "http://69.234.252.222:8820" // 测试
      : "http://69.234.252.222:8820", // 正式
  timeout: 1000 * 120,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers != undefined) {
      config.headers.Authorization =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6InRlc3QiLCJVc2VyRW1haWwiOiJ0ZXN0QG1lYi5jb20iLCJSb2xlIjoiYWRtaW4iLCJQZXJtaXNzaW9ucyI6IltdIiwiTG9naW5UaW1lIjoiMjAyMS0xMi0xNy8wMzoxMjowNiJ9.mpO-EijJhNuPbCZAqKLS_rDkEnHEJeb5JwVxF6XPH5I"; // 临时token
    //   config.data = qs.stringify(config.data);
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
