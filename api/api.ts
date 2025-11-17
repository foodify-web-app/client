import axios from "axios";
import { UUID } from "crypto";

const api = axios.create({
  baseURL: "http://localhost:80",
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.token = `${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (handle 401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            try {
                const { data } = await api.post(
                    `http://localhost:80/auth/refresh-token`,
                    {},
                    { headers: { token: originalRequest.headers.token } },
                );

                const newAccessToken = data.accessToken;
                localStorage.setItem("token", newAccessToken);
                api.defaults.headers.token = `${newAccessToken}`;
                return api(originalRequest); // retry original request
            } catch (err) {
                console.error("Refresh token expired or invalid");
                window.location.href = "/"; // redirect to login
            }
        }

        return Promise.reject(error);
    }
);


export const loginUser = (data : {}) => api.post("/auth/login", data)
export const logoutUser = () => api.post("/auth/logout")
// export const getUsers = () => api.get("/users");
// export const addUser = (data) => api.post("/users", data);
// export const deleteUser = (id: UUID) => api.delete(`/users/${id}`);

export default api;
