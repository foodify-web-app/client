import axios from "axios";

// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

const api = axios.create({
    // baseURL: API_BASE_URL,
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

        if (error.response?.status === 402) {
            try {
                const { data } = await api.post(
                    `${API_BASE_URL}:4000/api/auth/refresh-token`,
                    {},
                    { headers: { token: originalRequest.headers.token,
                        "Content-Type": "application/json"
                     } },
                );

                const newAccessToken = data.accessToken;
                localStorage.setItem("token", newAccessToken);
                api.defaults.headers.token = `${newAccessToken}`;
                return api(originalRequest); // retry original request
            } catch (err) {
                console.error("Refresh token expired or invalid");
                window.location.href = "/login"; // redirect to login
            }
        }

        return Promise.reject(error);
    }
);

// Helper to get userId
const getUserId = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem('userId');
    }
    return null;
};

// ============ AUTH APIs ============
export const loginUser = (body: { email: string; password: string }) => api.post("http://localhost:4000/api/auth/login", body);
export const logoutUser = () => api.post("http://localhost:4000/api/auth/logout");
export const refreshToken = () => api.post("http://localhost:4000/api/auth/refresh-token", {});

// ============ USER APIs ============
export const registerUser = (body: {}) => api.post('http://localhost:4000/api/auth/register', body);
export const getUserProfile = () => api.get('http://localhost:4000/api/auth/profile');
export const getUserById = (id: string) => api.get(`http://localhost:4000/api/auth/${id}`);
export const updateUser = (id: string, body: {}) => api.put(`http://localhost:4000/api/auth/update/${id}`, body);
export const getAllUsers = () => api.get('http://localhost:4000/api/auth/admin/all');
export const deleteUser = (id: string) => api.delete(`http://localhost:4000/api/auth/admin/delete/${id}`);

// ============ DISH APIs ============
export const getDishes = () => api.get('http://localhost:4002/api/dish/all');
export const getDishById = (id: string) => api.get(`http://localhost:4002/api/dish/${id}`);
export const getDishesByRestaurant = (restaurantId: string) => api.get(`http://localhost:4002/api/dish/restaurant/${restaurantId}`);
export const createDish = (formData: FormData) => api.post('http://localhost:4002/api/dish/create', formData);
export const deleteDish = (id: string) => api.delete(`http://localhost:4002/api/dish/${id}`);
export const updateDish = (id: string, formData: FormData) => api.put(`http://localhost:4002/api/dish/update/dish/${id}`, formData,
     {
    headers: { 'Content-Type': 'application/json' }
}
);
export const updateDishWithImage = (id: string, formData: FormData) => api.put(`http://localhost:4002/api/dish/update/image/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// ============ CART APIs ============
export const addToCart = (body: { userId: string; itemId: string }) => api.post('http://localhost:4003/api/cart/add', body);
export const removeFromCart = (body: { userId: string; itemId: string }) => api.post('http://localhost:4003/api/cart/remove', body);
export const removeItemFromCart = (body: { userId: string; itemId: string }) => api.post('http://localhost:4003/api/cart/remove/item', body);
export const getCartByUserId = (userId: string) => api.get(`http://localhost:4003/api/cart/userid/${userId}`);
export const getUserCartItems = (userId: string) => api.get(`http://localhost:4003/api/cart/items/userid/${userId}`);

// ============ ORDER APIs ============
export const placeOrder = (body: {}) => api.post('http://localhost:4004/api/order/place', body);
export const verifyOrder = (body: { orderId: string; success: string }) => api.post('http://localhost:4004/api/order/verify', body);
export const getUserOrders = (userId: string) => api.get(`http://localhost:4004/api/order/userorders/${userId}`);
export const getOrderById = (id: string) => api.get(`http://localhost:4004/api/order/${id}`);
export const getAllOrders = () => api.get('http://localhost:4004/api/order/list');
export const getOrdersByRestaurant = (restaurantId: string) => api.get(`http://localhost:4004/api/order/admin/restaurant/${restaurantId}`);
export const updateOrderStatus = (body: { orderId: string; status: string }) => api.post('http://localhost:4004/api/order/status', body);
export const updateOrderStatusById = (orderId: string, body: { status: string }) => api.patch(`http://localhost:4004/api/order/status/${orderId}`, body);
export const cancelOrder = (id: string) => api.post(`http://localhost:4004/api/order/cancel/${id}`);

// ============ RESTAURANT APIs ============
export const getAllRestaurants = () => api.get('http://localhost:4005/api/restaurant/all');
export const getRestaurantById = (id: string) => api.get(`http://localhost:4005/api/restaurant/${id}`);
export const getRestaurantByOwnerId = (ownerId: string) => api.get(`http://localhost:4005/api/restaurant/owner/${ownerId}`);
export const createRestaurant = (body: {}) => api.post('http://localhost:4005/api/restaurant/create', body);
export const updateRestaurant = (id: string, body: {}) => api.put(`http://localhost:4005/api/restaurant/update/${id}`, body);
export const updateRestaurantWithImage = (id: string, formData: FormData) => api.put(`http://localhost:4005/api/restaurant/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteRestaurant = (id: string) => api.delete(`http://localhost:4005/api/restaurant/${id}`);
export const getAllRestaurantsAdmin = () => api.get('http://localhost:4005/api/restaurant/admin/all');
export const updateRestaurantStatus = (id: string, body: { status: string }) => api.put(`http://localhost:4005/api/restaurant/admin/status/${id}`, body);

export default api;
