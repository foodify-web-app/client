import axios from "axios";

const api = axios.create({
    baseURL: "http://10.10.40.12:80",
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

        if (error.response?.status === 400) {
            try {
                const { data } = await api.post(
                    `http://10.10.40.12:80/auth/refresh-token`,
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
let userId: string | null;
if (typeof window !== "undefined") {
    userId = localStorage.getItem('userId');
}
export const loginUser = (body: {}) => api.post("/auth/login", body);
export const logoutUser = () => api.post("/auth/logout");
export const getDishes = () => api.get('/dishes/all');
export const addToCart = (body: {}) => api.post('/cart/add', body);
export const removeFromCart = (body: {}) => api.post('/cart/remove', body);
export const removeItemFromCart = (body: {}) => api.post('/cart/remove/item', body);
export const getUserCartItems = () => api.get(`/cart/items/userid/${userId}`)
export const registerUser = (body: {}) => api.post('/users/register', body);
// export const getUsers = () => api.get("/users");
// export const addUser = (data) => api.post("/users", data);
// export const deleteUser = (id: UUID) => api.delete(`/users/${id}`);

export default api;
