import axios from "axios";
import jwtDecode from "jwt-decode";

const accessToken = localStorage.getItem("accessToken")
  ? JSON.parse(localStorage.getItem("accessToken"))
  : null;

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

export const userApi = axios.create({
  baseURL: "http://localhost:5000/api/users",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});

export const postApi = axios.create({
  baseURL: "http://localhost:5000/api/posts",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const res = await authApi.post("/refresh", { accessToken });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

userApi.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const accessTokenDecoded = jwtDecode(accessToken);
    if (accessTokenDecoded.exp * 1000 < currentDate.getTime()) {
      const data = await refreshAccessToken();
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("user", JSON.stringify(data.user));
      config.headers.Authorization = data.accessToken
        ? `Bearer ${data.accessToken}`
        : "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

postApi.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const accessTokenDecoded = jwtDecode(accessToken);
    if (accessTokenDecoded.exp * 1000 < currentDate.getTime()) {
      const data = await refreshAccessToken();
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
      localStorage.setItem("user", JSON.stringify(data.user));
      config.headers.Authorization = data.accessToken
        ? `Bearer ${data.accessToken}`
        : "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    if (
      error.response?.status === 401 &&
      error.response.data?.message === "Unauthorized"
    ) {
      console.log("USER INT", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      await authApi.get("/logout");
    }
  }
);

postApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response.data?.message === "Unauthorized"
    ) {
      console.log(error);
      console.log("POST INT");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      await authApi.get("/logout");
    }
    return Promise.reject(error);
  }
);
