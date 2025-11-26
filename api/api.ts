import axios from "axios";

// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

const api = axios.create({
    baseURL: API_BASE_URL,
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
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { headers: { token: originalRequest.headers.token } },
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
export const loginUser = (body: { email: string; password: string }) => api.post("/auth/login", body);
export const logoutUser = () => api.post("/auth/logout");
export const refreshToken = () => api.post("/auth/refresh-token", {});

// ============ USER APIs ============
export const registerUser = (body: {}) => api.post('/users/register', body);
export const getUserProfile = () => api.get('/users/profile');
export const getUserById = (id: string) => api.get(`/users/${id}`);
export const updateUser = (id: string, body: {}) => api.put(`/users/update/${id}`, body);
export const getAllUsers = () => api.get('/users/admin/all');
export const deleteUser = (id: string) => api.delete(`/users/admin/delete/${id}`);

// ============ DISH APIs ============
export const getDishes = () => api.get('/dishes/all');
export const getDishById = (id: string) => api.get(`/dishes/${id}`);
export const getDishesByRestaurant = (restaurantId: string) => api.get(`/dishes/restaurant/${restaurantId}`);
export const createDish = (formData: FormData) => api.post('/dishes/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteDish = (id: string) => api.delete(`/dishes/${id}`);
export const updateDish = (id: string, formData: FormData) => api.put(`/dishes/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
// export const updateDishById = (id: string, formData: FormData) => api.put(`/dishes/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
// });

// ============ CART APIs ============
export const addToCart = (body: { userId: string; itemId: string }) => api.post('/cart/add', body);
export const removeFromCart = (body: { userId: string; itemId: string }) => api.post('/cart/remove', body);
export const removeItemFromCart = (body: { userId: string; itemId: string }) => api.post('/cart/remove/item', body);
export const getCartByUserId = (userId: string) => api.get(`/cart/userid/${userId}`);
export const getUserCartItems = (userId: string) => api.get(`/cart/items/userid/${userId}`);

// ============ ORDER APIs ============
export const placeOrder = (body: {}) => api.post('/orders/place', body);
export const verifyOrder = (body: { orderId: string; success: string }) => api.post('/orders/verify', body);
export const getUserOrders = (userId: string) => api.get(`/orders/userorders/${userId}`);
export const getOrderById = (id: string) => api.get(`/orders/${id}`);
export const getAllOrders = () => api.get('/orders/list');
export const getOrdersByRestaurant = (restaurantId: string) => api.get(`/orders/restaurant/${restaurantId}`);
export const updateOrderStatus = (body: { orderId: string; status: string }) => api.post('/orders/status', body);
export const updateOrderStatusById = (orderId: string, body: { status: string }) => api.patch(`/orders/status/${orderId}`, body);
export const cancelOrder = (id: string) => api.post(`/orders/cancel/${id}`);

// ============ RESTAURANT APIs ============
export const getAllRestaurants = () => api.get('/restaurants/all');
export const getRestaurantById = (id: string) => api.get(`/restaurants/${id}`);
export const getRestaurantByOwnerId = (ownerId: string) => api.get(`/restaurants/owner/${ownerId}`);
export const createRestaurant = (body: {}) => api.post('/restaurants/create', body);
export const updateRestaurant = (id: string, body: {}) => api.put(`/restaurants/update/${id}`, body);
export const updateRestaurantWithImage = (id: string, formData: FormData) => api.put(`/restaurants/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteRestaurant = (id: string) => api.delete(`/restaurants/${id}`);
export const getAllRestaurantsAdmin = () => api.get('/restaurants/admin/all');
export const updateRestaurantStatus = (id: string, body: { status: string }) => api.put(`/restaurants/admin/status/${id}`, body);

export default api;
